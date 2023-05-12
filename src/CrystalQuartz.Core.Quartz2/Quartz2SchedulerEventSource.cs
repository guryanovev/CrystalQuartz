namespace CrystalQuartz.Core.Quartz2
{
    using System;
    using CrystalQuartz.Core.Contracts;
    using CrystalQuartz.Core.Domain.Events;
    using CrystalQuartz.Core.Utils;
    using Quartz;

    internal class Quartz2SchedulerEventSource : ISchedulerEventSource, ITriggerListener, IJobListener
    {
        private readonly bool _handleJobInsteadOfTriggerForCompletion;

        public Quartz2SchedulerEventSource(bool handleJobInsteadOfTriggerForCompletion)
        {
            _handleJobInsteadOfTriggerForCompletion = handleJobInsteadOfTriggerForCompletion;
        }

        public event EventHandler<SchedulerEventArgs> EventEmitted;

        public string Name => "CrystalQuartzTriggersListener";

        public void TriggerFired(ITrigger trigger, IJobExecutionContext context)
        {
            // According to Quartz.NET recomendations we should make sure
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
        }

        public void JobToBeExecuted(IJobExecutionContext context)
        {
        }

        public void JobExecutionVetoed(IJobExecutionContext context)
        {
        }

        public void JobWasExecuted(IJobExecutionContext context, JobExecutionException jobException)
        {
            if (_handleJobInsteadOfTriggerForCompletion)
            {
                // According to Quartz.NET recomendations we should make sure
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
        }

        private void OnEventEmitted(RawSchedulerEvent payload)
        {
            EventEmitted?.Invoke(this, new SchedulerEventArgs(payload));
        }
    }
}