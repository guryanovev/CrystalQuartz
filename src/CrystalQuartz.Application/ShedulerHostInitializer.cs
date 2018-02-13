using System;
using System.IO;
using System.Reflection;
using CrystalQuartz.Core;
using CrystalQuartz.Core.Contracts;
using CrystalQuartz.Core.Quartz2;
using CrystalQuartz.Core.Quartz3;
using CrystalQuartz.Core.SchedulerProviders;
using CrystalQuartz.Core.Timeline;

namespace CrystalQuartz.Application
{
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
                                _schedulerHost = new SchedulerHost("Could not determine Quartz.NET version. Please make sure Quartz assemblies are referenced by the host project.");
                                return _schedulerHost;
                            }

                            Version quartzVersion = quartzAssembly.GetName().Version;

                            if (_schedulerEngine == null)
                            {
                                try
                                {
                                    _schedulerEngine = CreateSchedulerEngineBy(quartzVersion);
                                }
                                catch (Exception ex)
                                {
                                    _schedulerHost = new SchedulerHost(
                                        quartzVersion,
                                        "Could not create scheduler engine for provided Quartz.NET version " + quartzVersion.ToString(),
                                        ex.Message);

                                    return _schedulerHost;
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
                                    _schedulerHost = new SchedulerHost(quartzVersion, GetFileLoadingErrorMessage(ex, quartzVersion, quartzAssembly));
                                    return _schedulerHost;
                                }
                                catch (Exception ex)
                                {
                                    _schedulerHost = new SchedulerHost(
                                        quartzVersion,
                                        "An error occurred while instantiating the Scheduler. Please check your scheduler initialization code.",
                                        ex.Message);

                                    return _schedulerHost;
                                }
                            }

                            SchedulerServices services;

                            try
                            {
                                services = _schedulerEngine.CreateServices(_scheduler, _options);
                            }
                            catch (FileLoadException ex)
                            {
                                _schedulerHost = new SchedulerHost(quartzVersion, GetFileLoadingErrorMessage(ex, quartzVersion, quartzAssembly));
                                return _schedulerHost;
                            }
                            catch (Exception ex)
                            {
                                _schedulerHost = new SchedulerHost(
                                    quartzVersion,
                                    "An error occurred while initialization of scheduler services",
                                    ex.Message);

                                return _schedulerHost;
                            }

                            var eventHub = new SchedulerEventHub(1000, _options.TimelineSpan);
                            if (services.EventSource != null)
                            {
                                services.EventSource.EventEmitted += (sender, args) =>
                                {
                                    eventHub.Push(args.Payload);
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

        private ISchedulerEngine CreateSchedulerEngineBy(Version quartzVersion)
        {
            if (quartzVersion.Major < 3)
            {
                return new Quartz2SchedulerEngine();
            }

            return new Quartz3SchedulerEngine();
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