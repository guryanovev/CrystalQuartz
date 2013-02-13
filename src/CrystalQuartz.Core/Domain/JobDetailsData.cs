namespace CrystalQuartz.Core.Domain
{
    using System.Collections.Generic;

    public class JobDetailsData 
    {
        public JobDetailsData()
        {
            JobDataMap = new Dictionary<object, object>();
            JobProperties = new Dictionary<string, object>(); 
        }

        public JobData PrimaryData { get; set; }

        public IDictionary<object, object> JobDataMap { get; private set; }

        public IDictionary<string, object> JobProperties { get; private set; }
    }
}