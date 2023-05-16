namespace CrystalQuartz.Core.Domain.Activities
{
    using System.Collections.Generic;

    public class JobGroupData : ActivityNode<JobData>
    {
        public JobGroupData(string name, IList<JobData> jobs)
            : base(name, jobs)
        {
            Jobs = jobs;
        }

        public IList<JobData> Jobs { get; }
    }
}