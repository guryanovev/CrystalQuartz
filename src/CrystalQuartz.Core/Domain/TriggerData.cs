namespace CrystalQuartz.Core.Domain
{
    using CrystalQuartz.Core.Domain.TriggerTypes;

    public class TriggerData : Activity
    {
        public TriggerData(string name, ActivityStatus status) : base(name, status)
        {
        }

        public string UniqueTriggerKey { get; set; }

        public string GroupName { get; set; }

        public long StartDate { get; set; }

        public long? EndDate { get; set; }

        public long? NextFireDate { get; set; }

        public long? PreviousFireDate { get; set; }

        public TriggerType TriggerType { get; set; }
    }
}