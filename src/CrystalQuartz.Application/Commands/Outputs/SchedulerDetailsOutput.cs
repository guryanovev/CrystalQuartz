namespace CrystalQuartz.Application.Commands.Outputs
{
    using CrystalQuartz.Core.Domain;
    using CrystalQuartz.WebFramework.Commands;

    public class SchedulerDetailsOutput : CommandResult
    {
        public SchedulerDetails SchedulerDetails { get; set; }
    }
}