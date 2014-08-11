namespace CrystalQuartz.Core.Domain.TriggerTypes
{
    public class SimpleTriggerType : TriggerType
    {
        private readonly int _repeatCount;
        private readonly long _repeatInterval;
        private readonly int _timesTriggered;

        public SimpleTriggerType(int repeatCount, long repeatInterval, int timesTriggered) : base("simple")
        {
            _repeatCount = repeatCount;
            _repeatInterval = repeatInterval;
            _timesTriggered = timesTriggered;
        }

        public int RepeatCount
        {
            get { return _repeatCount; }
        }

        public long RepeatInterval
        {
            get { return _repeatInterval; }
        }

        public int TimesTriggered
        {
            get { return _timesTriggered; }
        }
    }
}