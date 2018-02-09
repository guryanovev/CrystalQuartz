using System;
using CrystalQuartz.Core.Contracts;

namespace CrystalQuartz.Application.Comands
{
    using System.Linq;
    using CrystalQuartz.Application.Comands.Outputs;
    using CrystalQuartz.Application.Helpers;
    using CrystalQuartz.Core.Timeline;

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

            ISchedulerEventHub eventHub = SchedulerHost.EventHub;

            output.Events = eventHub.List(input.MinEventId).ToArray();
        }

//        protected void RiseEvent(SchedulerEvent @event)
//        {
//            _hubFactory.GetHub().Push(@event);
//        }

        protected abstract void PerformOperation(TInput input);
    }
}