using System;
using CrystalQuartz.Core.Domain;
using CrystalQuartz.WebFramework.Commands;

namespace CrystalQuartz.Web.Comands.Outputs
{
    public class SchedulerDataOutput : CommandResult
    {
        public string Name { get; set; }

        public string InstanceId { get; set; }

        public JobGroupData[] JobGroups { get; set; }

        public TriggerGroupData[] TriggerGroups { get; set; }

        public SchedulerStatus Status { get; set; }

        public int JobsTotal { get; set; }

        public int JobsExecuted { get; set; }

        public bool IsRemote { get; set; }

        public DateTime? RunningSince { get; set; }

        public string SchedulerTypeName { get; set; }
    }
}