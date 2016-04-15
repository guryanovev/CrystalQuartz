namespace CrystalQuartz.Application.Comands
{
    using CrystalQuartz.Application.Comands.Inputs;
    using CrystalQuartz.Core;
    using CrystalQuartz.Core.SchedulerProviders;
    using Quartz;
    using Quartz.Impl.Matchers;

    public class PauseGroupCommand : AbstractOperationCommand<GroupInput>
    {
        public PauseGroupCommand(ISchedulerProvider schedulerProvider, ISchedulerDataProvider schedulerDataProvider) : base(schedulerProvider, schedulerDataProvider)
        {
        }

        protected override void PerformOperation(GroupInput input)
        {
            Scheduler.PauseJobs(GroupMatcher<JobKey>.GroupEquals(input.Group));
        }
    }
}