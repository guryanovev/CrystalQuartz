using System.Threading.Tasks;

namespace CrystalQuartz.Application.Comands
{
    using CrystalQuartz.Application.Comands.Inputs;
    using CrystalQuartz.Core;
    using CrystalQuartz.Core.SchedulerProviders;
    using Quartz;

    public class ExecuteNowCommand : AbstractOperationCommand<JobInput>
    {
        public ExecuteNowCommand(ISchedulerProvider schedulerProvider, ISchedulerDataProvider schedulerDataProvider) : base(schedulerProvider, schedulerDataProvider)
        {
        }

        protected override async Task PerformOperation(JobInput input)
        {
            await (await Scheduler().ConfigureAwait(false)).TriggerJob(new JobKey(input.Job, input.Group)).ConfigureAwait(false);
        }
    }
}