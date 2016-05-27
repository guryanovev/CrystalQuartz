namespace CrystalQuartz.Application.Comands
{
    using CrystalQuartz.Application.Comands.Inputs;
    using CrystalQuartz.Core;
    using CrystalQuartz.Core.SchedulerProviders;
    using Quartz;

    public class DeleteJobCommand : AbstractOperationCommand<JobInput>
    {
        public DeleteJobCommand(ISchedulerProvider schedulerProvider, ISchedulerDataProvider schedulerDataProvider) : base(schedulerProvider, schedulerDataProvider)
        {
        }

        protected override void PerformOperation(JobInput input)
        {
            Scheduler.DeleteJob(new JobKey(input.Job, input.Group));
        }
    }
}