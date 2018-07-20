using CrystalQuartz.WebFramework.Commands;

namespace CrystalQuartz.Application.Comands.Outputs
{
    public class EnvironmentDataOutput : CommandResult
    {
        public string SelfVersion { get; set; }

        public string QuartzVersion { get; set; }

        public string DotNetVersion { get; set; }

        public string CustomCssUrl { get; set; }

        public int TimelineSpan { get; set; }
    }
}