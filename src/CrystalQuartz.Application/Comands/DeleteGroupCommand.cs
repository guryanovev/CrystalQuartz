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

        protected override void PerformOperation(GroupInput input)
        {
            var keys = Scheduler.GetJobKeys(GroupMatcher<JobKey>.GroupEquals(input.Group));
            Scheduler.DeleteJobs(keys.ToList());
        }
    }
}