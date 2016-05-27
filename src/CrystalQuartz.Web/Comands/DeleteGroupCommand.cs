using System.Linq;
using CrystalQuartz.Core;
using CrystalQuartz.Core.SchedulerProviders;
using CrystalQuartz.Web.Comands.Inputs;
using Quartz;
using Quartz.Impl.Matchers;

namespace CrystalQuartz.Web.Comands
{
    public class DeleteGroupCommand : AbstractOperationCommand<GroupInput>
    {
        public DeleteGroupCommand(ISchedulerProvider schedulerProvider, ISchedulerDataProvider schedulerDataProvider) : base(schedulerProvider, schedulerDataProvider)
        {
        }

        protected override void PerformOperation(GroupInput input)
        {
            var keys = Scheduler.GetJobKeys(GroupMatcher<JobKey>.GroupEquals(input.Group));
            Scheduler.DeleteJobs(keys.ToList());
        }
    }
}