namespace CrystalQuartz.Web.Comands.Outputs
{
    public class EnvironmentDataOutput : CommandResultWithErrorDetails
    {
        public string SelfVersion { get; set; }

        public string QuartzVersion { get; set; }

        public string DotNetVersion { get; set; }
    }
}