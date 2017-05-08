namespace CrystalQuartz.Application.Comands
{
    using CrystalQuartz.Application.Comands.Inputs;
    using CrystalQuartz.Core;
    using CrystalQuartz.Core.SchedulerProviders;
    using CrystalQuartz.Core.Timeline;
    using Quartz;

    public class ResumeJobCommand : AbstractOperationCommand<JobInput>
    {
        public ResumeJobCommand(ISchedulerProvider schedulerProvider, ISchedulerDataProvider schedulerDataProvider, SchedulerHubFactory hubFactory) : base(schedulerProvider, schedulerDataProvider, hubFactory)
        {
        }

        protected override void PerformOperation(JobInput input)
        {
            Scheduler.ResumeJob(new JobKey(input.Job, input.Group));
        }
    }
}