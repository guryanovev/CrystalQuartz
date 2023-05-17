namespace CrystalQuartz.Core.Domain
{
    using System;

    public class SchedulerDetails
    {
        public string SchedulerName { get; set; }

        public string SchedulerInstanceId { get; set; }

        public bool SchedulerRemote { get; set; }

        public Type SchedulerType { get; set; }

        public string Version { get; set; }

        public bool InStandbyMode { get; set; }

        public bool Shutdown { get; set; }

        public bool Started { get; set; }

        public int NumberOfJobsExecuted { get; set; }

        public long? RunningSince { get; set; }

        public bool JobStoreClustered { get; set; }

        public bool JobStoreSupportsPersistence { get; set; }

        public Type JobStoreType { get; set; }

        public int ThreadPoolSize { get; set; }

        public Type ThreadPoolType { get; set; }
    }
}