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
    using CrystalQuartz.Core.Services;

    public class ShedulerHostInitializer
    {
        private readonly object _lock = new object();
        
        private readonly ISchedulerProvider _schedulerProvider;
        private readonly Options _options;

        private ISchedulerEngine _schedulerEngine;
        private bool _valueCreated;
        private SchedulerHost _schedulerHost;
        private object _scheduler;

        public ShedulerHostInitializer(ISchedulerProvider schedulerProvider, Options options)
        {
            _schedulerProvider = schedulerProvider;
            _options = options;
        }

        public SchedulerHost SchedulerHost
        {
            get
            {
                if (!_valueCreated)
                {
                    lock (_lock)
                    {
                        if (!_valueCreated)
                        {
                            Assembly quartzAssembly = FindQuartzAssembly();

                            if (quartzAssembly == null)
                            {
                                return AssignErrorHost("Could not determine Quartz.NET version. Please make sure Quartz assemblies are referenced by the host project.");
                            }

                            Version quartzVersion = quartzAssembly.GetName().Version;

                            if (_schedulerEngine == null)
                            {
                                try
                                {
                                    _schedulerEngine = CreateSchedulerEngineBy(quartzVersion);
                                    if (_schedulerEngine == null)
                                    {
                                        return AssignErrorHost("Could not create scheduler engine for Quartz.NET v" + quartzVersion, quartzVersion);
                                    }
                                }
                                catch (Exception ex)
                                {
                                    return AssignErrorHost("Could not create scheduler engine for provided Quartz.NET v" + quartzVersion, quartzVersion, ex);
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
                                    return AssignErrorHost(GetFileLoadingErrorMessage(ex, quartzVersion, quartzAssembly), quartzVersion);
                                }
                                catch (Exception ex)
                                {
                                    return AssignErrorHost("An error occurred while instantiating the Scheduler. Please check your scheduler initialization code.", quartzVersion, ex);
                                }
                            }

                            SchedulerServices services;
                            EventsTransformer eventsTransformer;

                            try
                            {
                                services = _schedulerEngine.CreateServices(_scheduler, _options);
                                eventsTransformer = new EventsTransformer(_options.ExceptionTransformer);
                            }
                            catch (FileLoadException ex)
                            {
                                return AssignErrorHost(GetFileLoadingErrorMessage(ex, quartzVersion, quartzAssembly), quartzVersion);
                            }
                            catch (Exception ex)
                            {
                                return AssignErrorHost("An error occurred while initialization of scheduler services", quartzVersion, ex);
                            }

                            var eventHub = new SchedulerEventHub(1000, _options.TimelineSpan);
                            if (services.EventSource != null)
                            {
                                services.EventSource.EventEmitted += (sender, args) =>
                                {
                                    eventHub.Push(eventsTransformer.Transform(args.Payload));
                                };
                            }

                            _schedulerHost = new SchedulerHost(services.Clerk, services.Commander, quartzVersion, eventHub, eventHub);

                            _valueCreated = true;
                        }
                    }
                }

                return _schedulerHost;
            }
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
@"Quartz.NET version mismatch detected. CrystalQuartz expects v{0} but {1} was found in the host application. Consider adding the following bindings to the .config file:

<dependentAssembly>
    <assemblyIdentity name=""Quartz"" publicKeyToken=""{2}"" culture=""neutral""/>
    <bindingRedirect oldVersion=""0.0.0.0-{3}.9.9.9"" newVersion=""{1}""/>
</dependentAssembly>", expectedVersion, quartzVersion, GetPublicKeyTokenFromAssembly(quartzAssembly), quartzVersion.Major);
                }
            }

            return exception.Message;
        }

        private SchedulerHost AssignErrorHost(string primaryError, Version version = null, Exception exception = null)
        {
            _schedulerHost = new SchedulerHost(version, new[] {primaryError}.Concat(GetExceptionMessages(exception)).ToArray());

            return _schedulerHost;
        }

        private IEnumerable<string> GetExceptionMessages(Exception exception)
        {
            if (exception == null)
            {
                yield break;
            }

            yield return exception.Message;

            var aggregateException = exception as AggregateException;
            if (aggregateException != null)
            {
                foreach (var innerMessage in aggregateException.InnerExceptions.SelectMany(GetExceptionMessages))
                {
                    yield return innerMessage;
                }
            }
            else if (exception.InnerException != null)
            {
                foreach (var exceptionMessage in GetExceptionMessages(exception))
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

            return _options.SchedulerEngineResolvers[quartzVersion.Major].Invoke(); // todo
        }

        private Assembly FindQuartzAssembly()
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