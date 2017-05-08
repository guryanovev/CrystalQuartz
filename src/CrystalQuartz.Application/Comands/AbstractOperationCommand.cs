namespace CrystalQuartz.Application.Comands
{
    using System.Linq;
    using CrystalQuartz.Application.Comands.Outputs;
    using CrystalQuartz.Application.Helpers;
    using CrystalQuartz.Core;
    using CrystalQuartz.Core.SchedulerProviders;
    using CrystalQuartz.Core.Timeline;

    public abstract class AbstractOperationCommand<TInput> : AbstractSchedulerCommand<TInput, SchedulerDataOutput>
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

            output.Events = _hubFactory.GetHub().List(0).ToArray();
        }

        protected abstract void PerformOperation(TInput input);
    }
}