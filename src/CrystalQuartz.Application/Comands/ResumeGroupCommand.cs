namespace CrystalQuartz.Application.Comands
{
    using CrystalQuartz.Application.Comands.Inputs;
    using CrystalQuartz.Core;
    using CrystalQuartz.Core.SchedulerProviders;
    using CrystalQuartz.Core.Timeline;
    using Quartz;
    using Quartz.Impl.Matchers;

    public class ResumeGroupCommand : AbstractOperationCommand<GroupInput>
    {
        public ResumeGroupCommand(ISchedulerProvider schedulerProvider, ISchedulerDataProvider schedulerDataProvider, SchedulerHubFactory hubFactory) : base(schedulerProvider, schedulerDataProvider, hubFactory)
        {
        }

        protected override void PerformOperation(GroupInput input)
        {
            Scheduler.ResumeJobs(GroupMatcher<JobKey>.GroupEquals(input.Group));
        }
    }
}