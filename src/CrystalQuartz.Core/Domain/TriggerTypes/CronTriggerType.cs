namespace CrystalQuartz.Core.Domain.TriggerTypes
{
    public class CronTriggerType : TriggerType
    {
        private readonly string _cronExpression;

        public CronTriggerType(string cronExpression) : base("cron")
        {
            _cronExpression = cronExpression;
        }

        public string CronExpression
        {
            get { return _cronExpression; }
        }
    }
}