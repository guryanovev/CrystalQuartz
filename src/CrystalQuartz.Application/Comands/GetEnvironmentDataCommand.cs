using CrystalQuartz.Core.Contracts;

namespace CrystalQuartz.Application.Comands
{
    using System;
    using System.Linq;
    using System.Reflection;
    using CrystalQuartz.Application.Comands.Inputs;
    using CrystalQuartz.Application.Comands.Outputs;
    using CrystalQuartz.WebFramework.Commands;
    using Microsoft.Win32;

    public class GetEnvironmentDataCommand : AbstractSchedulerCommand<NoInput, EnvironmentDataOutput>
    {
        private readonly string _customCssUrl;
        private readonly TimeSpan _timelineSpan;

        public GetEnvironmentDataCommand(Func<SchedulerHost> schedulerHostProvider, string customCssUrl, TimeSpan timelineSpan) : base(schedulerHostProvider)
        {
            _customCssUrl = customCssUrl;
            _timelineSpan = timelineSpan;
        }

        protected override void InternalExecute(NoInput input, EnvironmentDataOutput output)
        {
            output.SelfVersion = GetAssemblyVersion(Assembly.GetCallingAssembly());
            output.QuartzVersion = FormatAssemblyVersion(SchedulerHost.QuartzVersion);
            output.DotNetVersion = GetDotNetVersion();
            output.CustomCssUrl = _customCssUrl;
            output.TimelineSpan = (int) _timelineSpan.TotalMilliseconds;
        }

        private string GetAssemblyVersion(Assembly assembly)
        {
            var version = assembly.GetName().Version;
            return FormatAssemblyVersion(version);
        }

        private static string FormatAssemblyVersion(Version version)
        {
            return string.Format("v{0}", version);
        }

        private string GetDotNetVersion()
        {
            const string defaultDotNetVersion = "unknown";

            try
            {
                var installedVersions = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Microsoft\NET Framework Setup\NDP");
                if (installedVersions != null)
                {
                    var versionNames = installedVersions.GetSubKeyNames();

                    return versionNames.Last();
                }

                return defaultDotNetVersion;
            }
            catch (Exception)
            {
                return defaultDotNetVersion;
            }
        }
    }
}