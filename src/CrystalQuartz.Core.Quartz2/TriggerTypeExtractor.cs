namespace CrystalQuartz.Core.Quartz2
{
    using CrystalQuartz.Core.Domain.TriggerTypes;
    using Quartz;

    internal class TriggerTypeExtractor
    {
        public TriggerType GetFor(ITrigger trigger)
        {
            if (trigger is ISimpleTrigger simpleTrigger)
            {
                 return new SimpleTriggerType(
                     simpleTrigger.RepeatCount,
                     (long)simpleTrigger.RepeatInterval.TotalMilliseconds,
                     simpleTrigger.TimesTriggered);
            }

            if (trigger is ICronTrigger cronTrigger)
            {
                return new CronTriggerType(cronTrigger.CronExpressionString);
            }

            return new UnknownTriggerType();
        }
    }
}