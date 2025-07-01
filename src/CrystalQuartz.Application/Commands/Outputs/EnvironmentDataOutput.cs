namespace CrystalQuartz.Application.Commands.Outputs
{
    using CrystalQuartz.WebFramework.Commands;

    public class EnvironmentDataOutput : CommandResult
    {
        public string SelfVersion { get; set; } = default!;

        public string QuartzVersion { get; set; } = default!;

        public string DotNetVersion { get; set; } = default!;

        public string? CustomCssUrl { get; set; }

        public int TimelineSpan { get; set; }
    }
}