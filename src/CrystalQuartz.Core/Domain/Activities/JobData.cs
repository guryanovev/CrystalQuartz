using System.Collections.Generic;

namespace CrystalQuartz.Core.Domain.Activities
{
    public class JobData : ActivityNode<TriggerData>
    {
        public JobData(string name, string group, IList<TriggerData> triggers): base(name, triggers)
        {
            Triggers = triggers;
            GroupName = group;
        }

        public IList<TriggerData> Triggers { get; }

        public string GroupName { get; }

        public string UniqueName => string.Format("{0}_{1}", GroupName, Name);
    }
}