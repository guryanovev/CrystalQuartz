namespace CrystalQuartz.Application.Comands
{
    using CrystalQuartz.Application.Comands.Inputs;
    using CrystalQuartz.Core;
    using CrystalQuartz.Core.SchedulerProviders;
    using Quartz;

    public class ResumeJobCommand : AbstractOperationCommand<JobInput>
    {
        public ResumeJobCommand(ISchedulerProvider schedulerProvider, ISchedulerDataProvider schedulerDataProvider) : base(schedulerProvider, schedulerDataProvider)
        {
        }

        protected override void PerformOperation(JobInput input)
        {
            Scheduler.ResumeJob(new JobKey(input.Job, input.Group));
        }
    }
}