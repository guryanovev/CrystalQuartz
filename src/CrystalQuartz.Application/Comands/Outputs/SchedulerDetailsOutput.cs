namespace CrystalQuartz.Application.Comands.Outputs
{
    using CrystalQuartz.Core.Domain;

    public class SchedulerDetailsOutput : CommandResultWithErrorDetails
    {
        public SchedulerDetails SchedulerDetails { get; set; }
    }
}