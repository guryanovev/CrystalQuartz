namespace CrystalQuartz.Core.Quartz2
{
    using System;
    using CrystalQuartz.Core.Contracts;
    using CrystalQuartz.Core.Timeline;
    using Quartz;

    internal class Quartz2SchedulerEventSource : ISchedulerEventSource, ITriggerListener
    {
        public event EventHandler<SchedulerEventArgs> EventEmitted;

        public void TriggerFired(ITrigger trigger, IJobExecutionContext context)
        {
            // According to Quartz.NET recomendations we should make sure
            // listeners never throw any exceptions because that could
            // cause issues at a global Scheduler scope.

            try
            {
                OnEventEmitted(new SchedulerEvent(
                    SchedulerEventScope.Trigger,
                    SchedulerEventType.Fired,
                    context.Trigger.Key.ToString(),
                    context.FireInstanceId));
            }
            catch
            {
                // just ignore this
            }
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
            // According to Quartz.NET recomendations we should make sure
            // listeners never throw any exceptions because that could
            // cause issues at a global Scheduler scope.

            try
            {
                OnEventEmitted(new SchedulerEvent(
                    SchedulerEventScope.Trigger,
                    SchedulerEventType.Complete,
                    context.Trigger.Key.ToString(),
                    context.FireInstanceId));
            }
            catch
            {
                // just ignore this
            }
        }

        public string Name => "CrystalQuartzTriggersListener";

        private void OnEventEmitted(SchedulerEvent payload)
        {
            EventEmitted?.Invoke(this, new SchedulerEventArgs(payload));
        }
    }
}