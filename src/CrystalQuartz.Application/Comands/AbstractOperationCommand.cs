namespace CrystalQuartz.Application.Comands
{
    using CrystalQuartz.Application.Comands.Outputs;
    using CrystalQuartz.Application.Helpers;
    using CrystalQuartz.Core;
    using CrystalQuartz.Core.SchedulerProviders;

    public abstract class AbstractOperationCommand<TInput> : AbstractSchedulerCommand<TInput, SchedulerDataOutput>
    {
        protected AbstractOperationCommand(ISchedulerProvider schedulerProvider, ISchedulerDataProvider schedulerDataProvider) : base(schedulerProvider, schedulerDataProvider)
        {
        }

        protected override void InternalExecute(TInput input, SchedulerDataOutput output)
        {
            PerformOperation(input);

            SchedulerDataProvider.Data.MapToOutput(output);
        }

        protected abstract void PerformOperation(TInput input);
    }
}