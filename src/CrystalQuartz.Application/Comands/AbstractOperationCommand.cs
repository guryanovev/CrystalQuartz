using System;
using CrystalQuartz.Core.Contracts;

namespace CrystalQuartz.Application.Comands
{
    using System.Linq;
    using CrystalQuartz.Application.Comands.Outputs;
    using CrystalQuartz.Application.Helpers;
    using CrystalQuartz.Core.Domain.Events;
    using CrystalQuartz.Core.Services;

    public class SchedulerCommandInput
    {
        public int MinEventId { get; set; }
    }

    public abstract class AbstractOperationCommand<TInput> : AbstractSchedulerCommand<TInput, SchedulerDataOutput> where TInput : SchedulerCommandInput
    {
        protected AbstractOperationCommand(Func<SchedulerHost> schedulerHostProvider) : base(schedulerHostProvider)
        {
        }

        protected override void InternalExecute(TInput input, SchedulerDataOutput output)
        {
            PerformOperation(input);

            SchedulerHost.Clerk.GetSchedulerData().MapToOutput(output);

            output.ServerInstanceMarker = SchedulerHost.InstanceMarker;

            ISchedulerEventHub eventHub = SchedulerHost.EventHub;

            output.Events = eventHub.List(input.MinEventId).ToArray();
        }

        protected void RiseEvent(SchedulerEvent @event)
        {
            SchedulerHost.RaiseEvent(@event);
        }

        protected abstract void PerformOperation(TInput input);
    }
}