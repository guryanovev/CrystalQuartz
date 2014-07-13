using CrystalQuartz.WebFramework.Commands;

namespace CrystalQuartz.Web.Comands.Outputs
{
    public class JobDetailsOutput : CommandResult
    {
        public Property[] JobDataMap { get; set; }

        public Property[] JobProperties { get; set; }
    }
}