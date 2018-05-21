using CrystalQuartz.Core.Domain;
using CrystalQuartz.WebFramework.Commands;

namespace CrystalQuartz.Application.Comands.Outputs
{
    public class SchedulerDetailsOutput : CommandResult
    {
        public SchedulerDetails SchedulerDetails { get; set; }
    }
}