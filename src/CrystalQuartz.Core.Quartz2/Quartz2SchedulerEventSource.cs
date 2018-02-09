using System;
using CrystalQuartz.Core.Contracts;
using CrystalQuartz.Core.Timeline;
using Quartz;

namespace CrystalQuartz.Core.Quarz2
{
    public class Quartz2SchedulerEventSource : ISchedulerEventSource, ITriggerListener
    {
        public event EventHandler<SchedulerEventArgs> EventEmitted;

        public void TriggerFired(ITrigger trigger, IJobExecutionContext context)
        {
            OnEventEmitted(new SchedulerEvent(
                SchedulerEventScope.Trigger,
                SchedulerEventType.Fired,
                context.Trigger.Key.ToString(),
                context.FireInstanceId));
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
            OnEventEmitted(new SchedulerEvent(
                SchedulerEventScope.Trigger,
                SchedulerEventType.Complete,
                context.Trigger.Key.ToString(),
                context.FireInstanceId));
        }

        public string Name => "CrystalQuartzTriggersListener";

        private void OnEventEmitted(SchedulerEvent payload)
        {
            EventEmitted?.Invoke(this, new SchedulerEventArgs(payload));
        }
    }
}