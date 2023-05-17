namespace CrystalQuartz.Core.Domain.Events
{
    using System;

    public class RawSchedulerEvent
    {
        public RawSchedulerEvent(
            SchedulerEventScope scope,
            SchedulerEventType eventType,
            string itemKey,
            string fireInstanceId)
            : this(scope, eventType, itemKey, fireInstanceId, null, null)
        {
        }

        public RawSchedulerEvent(
            SchedulerEventScope scope,
            SchedulerEventType eventType,
            string itemKey,
            string fireInstanceId,
            Exception error,
            object rawJobResult)
        {
            Scope = scope;
            EventType = eventType;
            ItemKey = itemKey;
            FireInstanceId = fireInstanceId;
            Error = error;
            RawJobResult = rawJobResult;
        }

        public SchedulerEventScope Scope { get; }

        public SchedulerEventType EventType { get; }

        public string ItemKey { get; }

        public string FireInstanceId { get; }

        public Exception Error { get; }

        public object RawJobResult { get; }
    }
}