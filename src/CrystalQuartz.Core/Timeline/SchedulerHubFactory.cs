namespace CrystalQuartz.Core.Timeline
{
    using CrystalQuartz.Core.SchedulerProviders;
    using Quartz;

    public class SchedulerHubFactory
    {
        private readonly ISchedulerProvider _schedulerProvider;

        private readonly object padlock = new object();
        private bool isValueCreated = false;
        private SchedulerEventsHub _value;

        public SchedulerHubFactory(ISchedulerProvider schedulerProvider)
        {
            _schedulerProvider = schedulerProvider;
        }

        public SchedulerEventsHub GetHub()
        {
            if (!isValueCreated)
            {
                lock (padlock)
                {
                    if (!isValueCreated)
                    {
                        _value = CreateHubInstance();
                        isValueCreated = true;
                    }
                }
            }

            return _value;
        }

        private SchedulerEventsHub CreateHubInstance()
        {
            SchedulerEventsHub result = new SchedulerEventsHub();

            _schedulerProvider.Scheduler.ListenerManager.AddTriggerListener(new TriggerListener(result));
            return result;
        }
    }

    internal class TriggerListener : ITriggerListener
    {
        private readonly SchedulerEventsHub _eventsHub;

        public TriggerListener(SchedulerEventsHub eventsHub)
        {
            _eventsHub = eventsHub;
        }

        public void TriggerFired(ITrigger trigger, IJobExecutionContext context)
        {
            _eventsHub.Push(new SchedulerEvent("TRIGGER_FIRED", context.JobDetail.Key.Group, trigger.Key.Name, context.JobDetail.Key.Name, context.FireInstanceId, context.Trigger.Key.ToString()));
        }

        public bool VetoJobExecution(ITrigger trigger, IJobExecutionContext context)
        {
            return false;
        }

        public void TriggerMisfired(ITrigger trigger)
        {
        }

        public void TriggerComplete(ITrigger trigger, IJobExecutionContext context, SchedulerInstruction triggerInstructionCode)
        {
            _eventsHub.Push(new SchedulerEvent("TRIGGER_COMPLETE", context.JobDetail.Key.Group, trigger.Key.Name, context.JobDetail.Key.Name, context.FireInstanceId, context.Trigger.Key.ToString()));
        }

        public string Name
        {
            get { return "CrystalQuartzTriggersListener"; }
        }
    }
}