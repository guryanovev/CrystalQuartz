namespace CrystalQuartz.Application.Comands
{
    using System.Linq;
    using CrystalQuartz.Application.Comands.Outputs;
    using CrystalQuartz.Application.Helpers;
    using CrystalQuartz.Core;
    using CrystalQuartz.Core.SchedulerProviders;
    using CrystalQuartz.Core.Timeline;

    public class SchedulerCommandInput
    {
        public int MinEventId { get; set; }
    }

    public abstract class AbstractOperationCommand<TInput> : AbstractSchedulerCommand<TInput, SchedulerDataOutput> where TInput : SchedulerCommandInput
    {
        private readonly SchedulerHubFactory _hubFactory;

        protected AbstractOperationCommand(ISchedulerProvider schedulerProvider, ISchedulerDataProvider schedulerDataProvider, SchedulerHubFactory hubFactory) : base(schedulerProvider, schedulerDataProvider)
        {
            _hubFactory = hubFactory;
        }

        protected override void InternalExecute(TInput input, SchedulerDataOutput output)
        {
            PerformOperation(input);

            SchedulerDataProvider.Data.MapToOutput(output);

            SchedulerEventsHub eventsHub = _hubFactory.GetHub();

            output.Events = eventsHub.List(input.MinEventId).ToArray();
        }

        protected void RiseEvent(SchedulerEvent @event)
        {
            _hubFactory.GetHub().Push(@event);
        }

        protected abstract void PerformOperation(TInput input);
    }
}