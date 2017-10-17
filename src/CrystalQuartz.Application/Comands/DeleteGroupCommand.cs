using System.Threading.Tasks;

namespace CrystalQuartz.Application.Comands
{
    using System.Linq;
    using CrystalQuartz.Application.Comands.Inputs;
    using CrystalQuartz.Core;
    using CrystalQuartz.Core.SchedulerProviders;
    using Quartz;
    using Quartz.Impl.Matchers;

    public class DeleteGroupCommand : AbstractOperationCommand<GroupInput>
    {
        public DeleteGroupCommand(ISchedulerProvider schedulerProvider, ISchedulerDataProvider schedulerDataProvider) : base(schedulerProvider, schedulerDataProvider)
        {
        }

        protected override async Task PerformOperation(GroupInput input)
        {
            var keys = await (await Scheduler().ConfigureAwait(false)).GetJobKeys(GroupMatcher<JobKey>.GroupEquals(input.Group)).ConfigureAwait(false);
            await (await Scheduler().ConfigureAwait(false)).DeleteJobs(keys.ToList()).ConfigureAwait(false);
        }
    }
}