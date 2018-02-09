using System;
using System.Threading;
using System.Threading.Tasks;
using CrystalQuartz.Core.Contracts;
using CrystalQuartz.Core.Timeline;
using Quartz;

namespace CrystalQuartz.Core.Quartz3
{
    public class Quartz3SchedulerEventSource : ISchedulerEventSource, ITriggerListener
    {
        public event EventHandler<SchedulerEventArgs> EventEmitted;


        public void TriggerComplete(ITrigger trigger, IJobExecutionContext context, SchedulerInstruction triggerInstructionCode)
        {
            
        }

        public string Name => "CrystalQuartzTriggersListener";

        private void OnEventEmitted(SchedulerEvent payload)
        {
            EventEmitted?.Invoke(this, new SchedulerEventArgs(payload));
        }

        public async Task TriggerFired(ITrigger trigger, IJobExecutionContext context, CancellationToken cancellationToken = new CancellationToken())
        {
            OnEventEmitted(new SchedulerEvent(
                SchedulerEventScope.Trigger,
                SchedulerEventType.Fired,
                context.Trigger.Key.ToString(),
                context.FireInstanceId));
        }

        public async Task<bool> VetoJobExecution(ITrigger trigger, IJobExecutionContext context, CancellationToken cancellationToken = new CancellationToken())
        {
            return false;
        }

        public async Task TriggerMisfired(ITrigger trigger, CancellationToken cancellationToken = new CancellationToken())
        {
        }

        public async Task TriggerComplete(ITrigger trigger, IJobExecutionContext context, SchedulerInstruction triggerInstructionCode, CancellationToken cancellationToken = new CancellationToken())
        {
            OnEventEmitted(new SchedulerEvent(
                SchedulerEventScope.Trigger,
                SchedulerEventType.Complete,
                context.Trigger.Key.ToString(),
                context.FireInstanceId));
        }
    }
}