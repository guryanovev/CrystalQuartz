namespace CrystalQuartz.Application.Commands
{
    using System;
    using System.Linq;
    using System.Threading.Tasks;
    using CrystalQuartz.Application.Helpers;
    using CrystalQuartz.Core.Contracts;
    using CrystalQuartz.Core.Domain;
    using CrystalQuartz.Core.Domain.Events;
    using CrystalQuartz.Core.Services;
    using Outputs;

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
            await PerformOperation(input);

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

        protected abstract Task PerformOperation(TInput input);
    }
}