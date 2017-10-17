using System.Threading.Tasks;

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

        protected override async Task InternalExecute(TInput input, SchedulerDataOutput output)
        {
            await PerformOperation(input).ConfigureAwait(false);

            (await SchedulerDataProvider.Data().ConfigureAwait(false)).MapToOutput(output);
        }

        protected abstract Task PerformOperation(TInput input);
    }
}