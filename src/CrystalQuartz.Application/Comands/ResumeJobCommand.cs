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
            JobKey key = new JobKey(input.Job, input.Group);

            Scheduler.ResumeJob(key);

            RiseEvent(new SchedulerEvent(SchedulerEventScope.Job, SchedulerEventType.Resumed, key.ToString(), null));
        }
    }
}