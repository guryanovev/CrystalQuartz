namespace CrystalQuartz.Core.Domain
{
    using System.Collections.Generic;

    public class JobGroupData : ActivityNode<JobData>
    {
        public JobGroupData(string name, IList<JobData> jobs) : base(name)
        {
            Jobs = jobs;
        }

        public IList<JobData> Jobs { get; private set; }

        protected override IList<JobData> ChildrenActivities
        {
            get { return Jobs; }
        }
    }
}