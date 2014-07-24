using CrystalQuartz.WebFramework.Commands;

namespace CrystalQuartz.Web.Comands.Outputs
{
    public class EnvironmentDataOutput : CommandResult
    {
        public string SelfVersion { get; set; }

        public string QuartzVersion { get; set; }

        public string DotNetVersion { get; set; }
    }
}