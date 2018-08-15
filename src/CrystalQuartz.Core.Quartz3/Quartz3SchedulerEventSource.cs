namespace CrystalQuartz.Core.Quartz3
{
    using System;
    using System.Threading;
    using System.Threading.Tasks;
    using CrystalQuartz.Core.Contracts;
    using CrystalQuartz.Core.Timeline;
    using Quartz;

    internal class Quartz3SchedulerEventSource : ISchedulerEventSource, ITriggerListener, IJobListener
    {
        // Note: on .NET 4.6 we could use Task.CompletedTask instead
        private static readonly Task CompletedTask = Task.FromResult<object>(null);

        public event EventHandler<SchedulerEventArgs> EventEmitted;

        public Task JobToBeExecuted(IJobExecutionContext context, CancellationToken cancellationToken = new CancellationToken())
        {
            return CompletedTask;
        }

        public Task JobExecutionVetoed(IJobExecutionContext context, CancellationToken cancellationToken = new CancellationToken())
        {
            return CompletedTask;
        }

        public Task JobWasExecuted(IJobExecutionContext context, JobExecutionException jobException,
            CancellationToken cancellationToken = new CancellationToken())
        {
            return CompletedTask;
        }

        public string Name => "CrystalQuartzTriggersListener";

        private void OnEventEmitted(SchedulerEvent payload)
        {
            EventEmitted?.Invoke(this, new SchedulerEventArgs(payload));
        }

        public Task TriggerFired(ITrigger trigger, IJobExecutionContext context, CancellationToken cancellationToken = new CancellationToken())
        {
            OnEventEmitted(new SchedulerEvent(
                SchedulerEventScope.Trigger,
                SchedulerEventType.Fired,
                context.Trigger.Key.ToString(),
                context.FireInstanceId));

            return CompletedTask;
        }

        public Task<bool> VetoJobExecution(ITrigger trigger, IJobExecutionContext context, CancellationToken cancellationToken = new CancellationToken())
        {
            return Task.FromResult(false) ;
        }

        public Task TriggerMisfired(ITrigger trigger, CancellationToken cancellationToken = new CancellationToken())
        {
            return CompletedTask;
        }

        public Task TriggerComplete(ITrigger trigger, IJobExecutionContext context, SchedulerInstruction triggerInstructionCode, CancellationToken cancellationToken = new CancellationToken())
        {
            OnEventEmitted(new SchedulerEvent(
                SchedulerEventScope.Trigger,
                SchedulerEventType.Complete,
                context.Trigger.Key.ToString(),
                context.FireInstanceId));

            return CompletedTask;
        }
    }
}