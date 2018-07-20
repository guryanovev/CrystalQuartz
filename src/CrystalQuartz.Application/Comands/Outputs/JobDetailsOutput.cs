using CrystalQuartz.Core.Domain;
using CrystalQuartz.WebFramework.Commands;

namespace CrystalQuartz.Application.Comands.Outputs
{
    public class JobDetailsOutput : CommandResult
    {
        public Property[] JobDataMap { get; set; }

        public JobDetails JobDetails { get; set; }
    }
}