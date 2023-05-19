namespace CrystalQuartz.Core.Quartz3
{
    using System;
    using System.Threading;
    using System.Threading.Tasks;
    using CrystalQuartz.Core.Contracts;
    using CrystalQuartz.Core.Domain.Events;
    using CrystalQuartz.Core.Utils;
    using Quartz;

    internal class Quartz3SchedulerEventSource : ISchedulerEventSource, ITriggerListener, IJobListener
    {
        // Note: on .NET 4.6 we could use Task.CompletedTask instead
        private static readonly Task CompletedTask = Task.FromResult<object?>(null);

        private readonly bool _handleJobInsteadOfTriggerForCompletion;

        public Quartz3SchedulerEventSource(bool handleJobInsteadOfTriggerForCompletion)
        {
            _handleJobInsteadOfTriggerForCompletion = handleJobInsteadOfTriggerForCompletion;
        }

        public event EventHandler<SchedulerEventArgs>? EventEmitted;

        public string Name => "CrystalQuartzTriggersListener";

        public Task JobToBeExecuted(IJobExecutionContext context, CancellationToken cancellationToken = default)
        {
            return CompletedTask;
        }

        public Task JobExecutionVetoed(IJobExecutionContext context, CancellationToken cancellationToken = default)
        {
            return CompletedTask;
        }

        public Task JobWasExecuted(IJobExecutionContext context, JobExecutionException jobException, CancellationToken cancellationToken = default)
        {
            if (_handleJobInsteadOfTriggerForCompletion)
            {
                // According to Quartz.NET recommendations we should make sure
                // listeners never throw any exceptions because that could
                // cause issues at a global Scheduler scope.
                try
                {
                    OnEventEmitted(new RawSchedulerEvent(
                        SchedulerEventScope.Trigger,
                        SchedulerEventType.Complete,
                        context.Trigger.Key.ToString(),
                        context.FireInstanceId,
                        jobException.Unwrap<JobExecutionException>().Unwrap<SchedulerException>(),
                        context.Result));
                }
                catch
                {
                    // just ignore this
                }
            }

            return CompletedTask;
        }

        public Task TriggerFired(ITrigger trigger, IJobExecutionContext context, CancellationToken cancellationToken = default)
        {
            // According to Quartz.NET recommendations we should make sure
            // listeners never throw any exceptions because that could
            // cause issues at a global Scheduler scope.
            try
            {
                OnEventEmitted(new RawSchedulerEvent(
                    SchedulerEventScope.Trigger,
                    SchedulerEventType.Fired,
                    context.Trigger.Key.ToString(),
                    context.FireInstanceId));
            }
            catch
            {
                // just ignore this
            }

            return CompletedTask;
        }

        public Task<bool> VetoJobExecution(ITrigger trigger, IJobExecutionContext context, CancellationToken cancellationToken = default)
        {
            return Task.FromResult(false);
        }

        public Task TriggerMisfired(ITrigger trigger, CancellationToken cancellationToken = default)
        {
            return CompletedTask;
        }

        public Task TriggerComplete(ITrigger trigger, IJobExecutionContext context, SchedulerInstruction triggerInstructionCode, CancellationToken cancellationToken = default)
        {
            // Note that we do not have access to job exception in TriggerComplete
            if (!_handleJobInsteadOfTriggerForCompletion)
            {
                // According to Quartz.NET recommendations we should make sure
                // listeners never throw any exceptions because that could
                // cause issues at a global Scheduler scope.
                try
                {
                    OnEventEmitted(new RawSchedulerEvent(
                        SchedulerEventScope.Trigger,
                        SchedulerEventType.Complete,
                        context.Trigger.Key.ToString(),
                        context.FireInstanceId,
                        null,
                        context.Result));
                }
                catch
                {
                    // just ignore this
                }
            }

            return CompletedTask;
        }

        private void OnEventEmitted(RawSchedulerEvent payload)
        {
            EventEmitted?.Invoke(this, new SchedulerEventArgs(payload));
        }
    }
}