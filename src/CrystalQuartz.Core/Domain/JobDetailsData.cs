namespace CrystalQuartz.Core.Domain
{
    using System.Collections.Generic;

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