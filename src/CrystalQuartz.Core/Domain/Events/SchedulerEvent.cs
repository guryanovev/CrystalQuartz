namespace CrystalQuartz.Core.Domain.Events
{
    using CrystalQuartz.Core.Domain.Base;

    public class SchedulerEvent
    {
        public SchedulerEvent(
            SchedulerEventScope scope, 
            SchedulerEventType eventType, 
            string itemKey, 
            string fireInstanceId) : this(scope, eventType, itemKey, fireInstanceId, null, false)
        {
        }

        public SchedulerEvent(SchedulerEventScope scope, SchedulerEventType eventType, string itemKey, string fireInstanceId, ErrorMessage[] errors, bool faulted)
        {
            Scope = scope;
            EventType = eventType;
            ItemKey = itemKey;
            FireInstanceId = fireInstanceId;
            Errors = errors;
            Faulted = faulted;
        }

        public SchedulerEventScope Scope { get; }

        public SchedulerEventType EventType { get; }

        public string ItemKey { get; }

        public string FireInstanceId { get; }

        public bool Faulted { get; }

        public ErrorMessage[] Errors { get; }
    }
}