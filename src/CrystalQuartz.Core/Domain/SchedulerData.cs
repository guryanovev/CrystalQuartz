using CrystalQuartz.Core.Domain.Activities;

namespace CrystalQuartz.Core.Domain
{
    using System;
    using System.Collections.Generic;

    public class SchedulerData
    {
        public string Name { get; set; }

        public string InstanceId { get; set; }

        public IList<JobGroupData> JobGroups { get; set; }

        public SchedulerStatus Status { get; set; }

        public int JobsTotal { get; set; }

        public int JobsExecuted { get; set; }

        public IList<ExecutingJobInfo> InProgress { get; set; }

        public DateTime? RunningSince { get; set; }
    }
}