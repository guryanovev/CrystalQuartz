using CrystalQuartz.Core.Domain;
using CrystalQuartz.Core.Domain.Activities;
using CrystalQuartz.Core.Timeline;
using CrystalQuartz.WebFramework.Commands;

namespace CrystalQuartz.Application.Comands.Outputs
{
    public class SchedulerDataOutput : CommandResult
    {
        public string Name { get; set; }

        public string InstanceId { get; set; }

        public JobGroupData[] JobGroups { get; set; }

        public string Status { get; set; }

        public int JobsTotal { get; set; }

        public int JobsExecuted { get; set; }

        public long? RunningSince { get; set; }

        public SchedulerEventData[] Events { get; set; }

        public ExecutingJobInfo[] InProgress { get; set; }
    }
}