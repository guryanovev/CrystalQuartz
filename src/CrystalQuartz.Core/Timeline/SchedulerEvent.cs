namespace CrystalQuartz.Core.Timeline
{
    public enum SchedulerEventScope
    {
        Scheduler = 0,
        Group = 1,
        Job = 2,
        Trigger = 3
    }

    public enum SchedulerEventType
    {
        Fired = 0,
        Complete = 1,
        Paused = 2,
        Resumed = 3,
        Standby = 4,
        Shutdown = 5
    }

    public class SchedulerEvent
    {
        private readonly SchedulerEventScope _scope;
        private readonly SchedulerEventType _eventType;
        private readonly string _itemKey;
        private readonly string _fireInstanceId;

        public SchedulerEvent(SchedulerEventScope scope, SchedulerEventType eventType, string itemKey, string fireInstanceId)
        {
            _scope = scope;
            _eventType = eventType;
            _itemKey = itemKey;
            _fireInstanceId = fireInstanceId;
        }

        public int Scope
        {
            get { return (int) _scope; }
        }

        public int EventType
        {
            get { return (int) _eventType; }
        }

        public string ItemKey
        {
            get { return _itemKey; }
        }

        public string FireInstanceId
        {
            get { return _fireInstanceId; }
        }

//        private readonly string _typeCode;
//        private readonly string _group;
//        private readonly string _trigger;
//        private readonly string _job;
//        private readonly string _fireInstanceId;
//        private readonly string _uniqueTriggerKey;
//
//        public SchedulerEvent(string typeCode, string @group, string trigger, string job, string fireInstanceId, string uniqueTriggerKey)
//        {
//            _typeCode = typeCode;
//            _group = @group;
//            _trigger = trigger;
//            _job = job;
//            _fireInstanceId = fireInstanceId;
//            _uniqueTriggerKey = uniqueTriggerKey;
//        }
//
//        public string TypeCode
//        {
//            get { return _typeCode; }
//        }
//
//        public string Group
//        {
//            get { return _group; }
//        }
//
//        public string Trigger
//        {
//            get { return _trigger; }
//        }
//
//        public string Job
//        {
//            get { return _job; }
//        }
//
//        public string FireInstanceId
//        {
//            get { return _fireInstanceId; }
//        }
//
//        public string UniqueTriggerKey
//        {
//            get { return _uniqueTriggerKey; }
//        }
    }
}