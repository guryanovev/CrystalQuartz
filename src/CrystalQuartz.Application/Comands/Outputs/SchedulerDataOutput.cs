namespace CrystalQuartz.Application.Comands.Outputs
{
    using System;
    using CrystalQuartz.Core.Domain;

    public class SchedulerDataOutput : CommandResultWithErrorDetails
    {
        public string Name { get; set; }

        public string InstanceId { get; set; }

        public JobGroupData[] JobGroups { get; set; }

        public TriggerGroupData[] TriggerGroups { get; set; }

        public string Status { get; set; }

        public int JobsTotal { get; set; }

        public int JobsExecuted { get; set; }

        public bool IsRemote { get; set; }

        public DateTime? RunningSince { get; set; }

        public string SchedulerTypeName { get; set; }

        public bool CanStart { get; set; }

        public bool CanShutdown { get; set; }
    }
}