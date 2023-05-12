using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using CrystalQuartz.Core;
using CrystalQuartz.Core.Contracts;
using CrystalQuartz.Core.SchedulerProviders;

namespace CrystalQuartz.Application
{
    using System.Threading;
    using System.Threading.Tasks;
    using CrystalQuartz.Core.Services;

    public class SchedulerHostInitializer : ISchedulerHostProvider
    {
        private readonly ISchedulerProvider _schedulerProvider;
        private readonly Options _options;
        private readonly SemaphoreSlim _semaphore = new SemaphoreSlim(1, 1);

        private ISchedulerEngine _schedulerEngine;
        private SchedulerHost _schedulerHost;
        private object _scheduler;

        public bool SchedulerHostCreated => _schedulerHost != null;

        public SchedulerHost SchedulerHost => _schedulerHost ?? throw new Exception("Scheduler host has not been properly initialized");

        public SchedulerHostInitializer(ISchedulerProvider schedulerProvider, Options options)
        {
            _schedulerProvider = schedulerProvider;
            _options = options;
        }

        public void ResetCreatedSchedulerHost()
        {
            _schedulerHost = null;
        }

        public async Task EnsureHostCreated()
        {
            // We use semaphore to make sure SchedulerHost is never
            // created more than once.
#if NET40
            _semaphore.Wait();
#else
            await _semaphore.WaitAsync();
#endif

            try
            {
                // Make sure we do this check inside the semaphore scope
                // This would be a second part of double-check pattern as client
                // code would check SchedulerHostCreated flag before calling
                // the EnsureHostCreated method.
                if (SchedulerHostCreated)
                {
                    return;
                }

                _schedulerHost = await CreateSchedulerHostInternal();
            }
            finally
            {
                _semaphore.Release();
            }
        }

        private async Task<SchedulerHost> CreateSchedulerHostInternal()
        {
            Assembly quartzAssembly = FindQuartzAssembly();

            if (quartzAssembly == null)
            {
                return CreateErrorHost(
                    "Could not determine Quartz.NET version. Please make sure Quartz assemblies are referenced by the host project.");
            }

            Version quartzVersion = quartzAssembly.GetName().Version;

            if (_schedulerEngine == null)
            {
                try
                {
                    _schedulerEngine = CreateSchedulerEngineBy(quartzVersion);
                    if (_schedulerEngine == null)
                    {
                        return CreateErrorHost(
                            "Could not create scheduler engine for Quartz.NET v" + quartzVersion,
                            quartzVersion);
                    }
                }
                catch (Exception ex)
                {
                    return CreateErrorHost(
                        "Could not create scheduler engine for provided Quartz.NET v" + quartzVersion,
                        quartzVersion, ex);
                }
            }

            if (_scheduler == null)
            {
                try
                {
                    _scheduler = _schedulerProvider.CreateScheduler(_schedulerEngine);
                }
                catch (FileLoadException ex)
                {
                    return CreateErrorHost(
                        GetFileLoadingErrorMessage(ex, quartzVersion, quartzAssembly),
                        quartzVersion);
                }
                catch (Exception ex)
                {
                    return CreateErrorHost(
                        "An error occurred while instantiating the Scheduler. Please check your scheduler initialization code.",
                        quartzVersion, ex);
                }
            }

            SchedulerServices services;
            EventsTransformer eventsTransformer;

            try
            {
                services = await _schedulerEngine.CreateServices(_scheduler, _options);
                eventsTransformer = new EventsTransformer(
                    _options.ExceptionTransformer,
                    _options.JobResultAnalyser);
            }
            catch (FileLoadException ex)
            {
                return CreateErrorHost(
                    GetFileLoadingErrorMessage(ex, quartzVersion, quartzAssembly),
                    quartzVersion);
            }
            catch (Exception ex)
            {
                return CreateErrorHost(
                    "An error occurred while initialization of scheduler services",
                    quartzVersion, ex);
            }

            var eventHub = new SchedulerEventHub(1000, _options.TimelineSpan, eventsTransformer);
            if (services.EventSource != null)
            {
                services.EventSource.EventEmitted += (sender, args) => { eventHub.Push(args.Payload); };
            }

            return new SchedulerHost(
                services.Clerk,
                services.Commander,
                quartzVersion,
                eventHub,
                eventHub,
                new AllowedJobTypesRegistry(_options.AllowedJobTypes, services.Clerk));
        }

        private string GetFileLoadingErrorMessage(FileLoadException exception, Version quartzVersion, Assembly quartzAssembly)
        {
            if (exception.FileName.StartsWith("Quartz,"))
            {
                string[] fileNameParts = exception.FileName.Split(',', '=');
                if (fileNameParts.Length > 2 && fileNameParts[1].Trim().Equals("Version", StringComparison.InvariantCultureIgnoreCase))
                {
                    string expectedVersion = fileNameParts[2];

                    return string.Format(
@"Quartz.NET version mismatch detected. CrystalQuartz v{0} expected but {1} was found in the host application. Consider adding the following bindings to the .config file:

<dependentAssembly>
    <assemblyIdentity name=""Quartz"" publicKeyToken=""{2}"" culture=""neutral""/>
    <bindingRedirect oldVersion=""0.0.0.0-{3}.9.9.9"" newVersion=""{1}""/>
</dependentAssembly>", expectedVersion, quartzVersion, GetPublicKeyTokenFromAssembly(quartzAssembly), quartzVersion.Major);
                }
            }

            return exception.Message;
        }

        private SchedulerHost CreateErrorHost(string primaryError, Version version = null, Exception exception = null) =>
            new SchedulerHost(
                version,
                new[] { primaryError }.Concat(GetExceptionMessages(exception)).ToArray());

        private static IEnumerable<string> GetExceptionMessages(Exception exception)
        {
            if (exception == null)
            {
                yield break;
            }

            yield return exception.Message;

            if (exception is AggregateException aggregateException)
            {
                foreach (var innerMessage in aggregateException.InnerExceptions.SelectMany(GetExceptionMessages))
                {
                    yield return innerMessage;
                }
            }
            else if (exception.InnerException != null)
            {
                foreach (var exceptionMessage in GetExceptionMessages(exception.InnerException))
                {
                    yield return exceptionMessage;
                }
            }
        }

        private ISchedulerEngine CreateSchedulerEngineBy(Version quartzVersion)
        {
            if (!_options.SchedulerEngineResolvers.ContainsKey(quartzVersion.Major))
            {
                return null;
            }

            return _options.SchedulerEngineResolvers[quartzVersion.Major].Invoke();
        }

        private static Assembly FindQuartzAssembly()
        {
            Type quartzSchedulerType = Type.GetType("Quartz.IScheduler, Quartz");
            if (quartzSchedulerType == null)
            {
                return null;
            }

            return quartzSchedulerType.Assembly;
        }

        private static string GetPublicKeyTokenFromAssembly(Assembly assembly)
        {
            var bytes = assembly.GetName().GetPublicKeyToken();
            if (bytes == null || bytes.Length == 0)
            {
                return "None";
            }

            var publicKeyToken = string.Empty;
            for (int i = 0; i < bytes.GetLength(0); i++)
            {
                publicKeyToken += string.Format("{0:x2}", bytes[i]);
            }

            return publicKeyToken;
        }
    }
}