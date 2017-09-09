namespace CrystalQuartz.Application.Comands
{
    using CrystalQuartz.Application.Comands.Inputs;
    using CrystalQuartz.Core;
    using CrystalQuartz.Core.SchedulerProviders;
    using CrystalQuartz.Core.Timeline;
    using Quartz;

    public class PauseJobCommand : AbstractOperationCommand<JobInput>
    {
        public PauseJobCommand(ISchedulerProvider schedulerProvider, ISchedulerDataProvider schedulerDataProvider, SchedulerHubFactory hubFactory) : base(schedulerProvider, schedulerDataProvider, hubFactory)
        {
        }

        protected override void PerformOperation(JobInput input)
        {
            JobKey key = new JobKey(input.Job, input.Group);

            Scheduler.PauseJob(key);

            RiseEvent(new SchedulerEvent(SchedulerEventScope.Job, SchedulerEventType.Paused, key.ToString(), null));
        }
    }
}