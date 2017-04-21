namespace CrystalQuartz.Application.Comands.Inputs
{
    public class AddTriggerInput : JobInput
    {
        /// <summary>
        /// New trigger name (optional)
        /// </summary>
        public string Name { get; set; }

        public string TriggerType { get; set; }

        public string CronExpression { get; set; }

        public bool RepeatForever { get; set; }

        public int RepeatCount { get; set; }

        public long RepeatInterval { get; set; }
    }
}