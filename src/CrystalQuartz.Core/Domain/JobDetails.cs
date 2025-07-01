namespace CrystalQuartz.Core.Domain
{
    using System;

    public class JobDetails
    {
        public string? Description { get; set; }

        public bool ConcurrentExecutionDisallowed { get; set; }

        public bool PersistJobDataAfterExecution { get; set; }

        public bool RequestsRecovery { get; set; }

        public bool Durable { get; set; }

        public Type JobType { get; set; }
    }
}