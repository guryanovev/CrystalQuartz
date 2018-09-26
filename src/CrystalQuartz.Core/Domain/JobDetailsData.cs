using System.Collections.Generic;
using CrystalQuartz.Core.Domain.ObjectTraversing;

namespace CrystalQuartz.Core.Domain
{
    using System;

    public class JobDetails
    {
        public string Description { get; set; }

        public bool ConcurrentExecutionDisallowed { get; set; }

        public bool PersistJobDataAfterExecution { get; set; }

        public bool RequestsRecovery { get; set; }

        public bool Durable { get; set; }

        public Type JobType { get; set; }
    }

    public class JobDetailsData
    {
        public JobDetailsData(JobDetails jobDetails, IDictionary<string, object> jobDataMap)
        {
            JobDetails = jobDetails;
            JobDataMap = jobDataMap;
        }

        public JobDetails JobDetails { get; }

        public IDictionary<string, object> JobDataMap { get; }
    }
}