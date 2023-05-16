namespace CrystalQuartz.Application.Commands.Outputs
{
    using CrystalQuartz.Core.Domain;
    using CrystalQuartz.Core.Domain.Activities;
    using CrystalQuartz.Core.Domain.Events;
    using CrystalQuartz.WebFramework.Commands;

    public class SchedulerDataOutput : CommandResult
    {
        public string Name { get; set; }

        public string InstanceId { get; set; }

        public JobGroupData[] JobGroups { get; set; }

        public string Status { get; set; }

        public int JobsTotal { get; set; }

        public int JobsExecuted { get; set; }

        public long? RunningSince { get; set; }

        public SchedulerEvent[] Events { get; set; }

        public ExecutingJobInfo[] InProgress { get; set; }

        public long ServerInstanceMarker { get; set; }
    }
}