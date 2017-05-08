namespace CrystalQuartz.Application.Comands
{
    using CrystalQuartz.Application.Comands.Inputs;
    using CrystalQuartz.Core;
    using CrystalQuartz.Core.SchedulerProviders;
    using CrystalQuartz.Core.Timeline;
    using Quartz;
    using Quartz.Impl.Matchers;

    public class PauseGroupCommand : AbstractOperationCommand<GroupInput>
    {
        public PauseGroupCommand(ISchedulerProvider schedulerProvider, ISchedulerDataProvider schedulerDataProvider, SchedulerHubFactory hubFactory) : base(schedulerProvider, schedulerDataProvider, hubFactory)
        {
        }

        protected override void PerformOperation(GroupInput input)
        {
            Scheduler.PauseJobs(GroupMatcher<JobKey>.GroupEquals(input.Group));
        }
    }
}