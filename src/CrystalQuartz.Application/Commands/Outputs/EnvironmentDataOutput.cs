namespace CrystalQuartz.Application.Commands.Outputs
{
    using CrystalQuartz.WebFramework.Commands;

    public class EnvironmentDataOutput : CommandResult
    {
        public string SelfVersion { get; set; }

        public string QuartzVersion { get; set; }

        public string DotNetVersion { get; set; }

        public string CustomCssUrl { get; set; }

        public int TimelineSpan { get; set; }

        public bool IsReadOnly { get; set; }
    }
}