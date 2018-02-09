using System.Collections.Generic;

namespace CrystalQuartz.Core.Domain.Activities
{
    public class JobGroupData : ActivityNode<JobData>
    {
        public JobGroupData(string name, IList<JobData> jobs) : base(name, jobs)
        {
            Jobs = jobs;
        }

        public IList<JobData> Jobs { get; }
    }
}