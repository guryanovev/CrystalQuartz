namespace CrystalQuartz.Core.Domain
{
    using System.Collections.Generic;
    using CrystalQuartz.Core.Domain.Activities;

    public class TriggerDetailsData
    {
        public TriggerData PrimaryTriggerData { get; set; }

        public TriggerSecondaryData SecondaryTriggerData { get; set; }

        public IDictionary<string, object> JobDataMap { get; set; }
    }
}