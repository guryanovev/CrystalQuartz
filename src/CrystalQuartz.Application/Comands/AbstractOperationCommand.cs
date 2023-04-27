using System;
using CrystalQuartz.Core.Contracts;

namespace CrystalQuartz.Application.Comands
{
    using System.Linq;
    using System.Threading.Tasks;
    using Core.Domain;
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

        protected override async Task InternalExecute(TInput input, SchedulerDataOutput output)
        {
            PerformOperation(input);

            SchedulerData schedulerData = await SchedulerHost.Clerk.GetSchedulerData();
            
            schedulerData.MapToOutput(output);

            output.ServerInstanceMarker = SchedulerHost.InstanceMarker;

            ISchedulerEventHub eventHub = SchedulerHost.EventHub;

            output.Events = eventHub.List(input.MinEventId).ToArray();
        }

        protected void RiseEvent(RawSchedulerEvent @event)
        {
            SchedulerHost.RaiseEvent(@event);
        }

        protected abstract void PerformOperation(TInput input);
    }
}