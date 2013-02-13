namespace CrystalQuartz.Core.Domain
{
    using System.Collections.Generic;

    public class JobData : ActivityNode<TriggerData>
    {
        public JobData(string name, string group, IList<TriggerData> triggers): base(name)
        {
            Triggers = triggers;
            GroupName = group;
        }

        public IList<TriggerData> Triggers { get; private set; }

        public string GroupName { get; private set; }

        public string UniqueName
        {
            get
            {
                return string.Format("{0}_{1}", GroupName, Name);
            }
        }

        public bool HaveTriggers
        {
            get
            {
                return Triggers != null && Triggers.Count > 0;
            }
        }

        protected override IList<TriggerData> ChildrenActivities
        {
            get { return Triggers; }
        }
    }
}