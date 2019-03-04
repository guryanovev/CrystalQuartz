namespace CrystalQuartz.Stubs
{
    using System.Collections.Generic;
    using CrystalQuartz.Core.Domain.TriggerTypes;

    public class TriggerStub
    {
        public TriggerStub(string name, TriggerType trigger, IDictionary<string, object> triggerJobData)
        {
            Name = name;
            Trigger = trigger;
            TriggerJobData = triggerJobData;
        }

        public string Name { get; }

        public TriggerType Trigger { get; }

        public IDictionary<string, object> TriggerJobData { get; }
    }
}