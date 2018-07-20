using CrystalQuartz.Core.Domain.TriggerTypes;

namespace CrystalQuartz.Core.Domain.Activities
{
    public class TriggerData : Activity
    {
        public TriggerData(string uniqueTriggerKey, string groupName, string name, ActivityStatus status, long startDate, long? endDate, long? nextFireDate, long? previousFireDate, TriggerType triggerType) : base(name, status)
        {
            UniqueTriggerKey = uniqueTriggerKey;
            GroupName = groupName;
            StartDate = startDate;
            EndDate = endDate;
            NextFireDate = nextFireDate;
            PreviousFireDate = previousFireDate;
            TriggerType = triggerType;
        }

        public string UniqueTriggerKey { get; }

        public string GroupName { get; }

        public long StartDate { get; }

        public long? EndDate { get; }

        public long? NextFireDate { get; }

        public long? PreviousFireDate { get; }

        public TriggerType TriggerType { get; }
    }
}