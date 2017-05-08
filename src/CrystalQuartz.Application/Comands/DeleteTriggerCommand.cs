namespace CrystalQuartz.Application.Comands
{
    using CrystalQuartz.Application.Comands.Inputs;
    using CrystalQuartz.Core;
    using CrystalQuartz.Core.SchedulerProviders;
    using CrystalQuartz.Core.Timeline;
    using Quartz;

    public class DeleteTriggerCommand : AbstractOperationCommand<TriggerInput>
    {
        public DeleteTriggerCommand(ISchedulerProvider schedulerProvider, ISchedulerDataProvider schedulerDataProvider, SchedulerHubFactory hubFactory) : base(schedulerProvider, schedulerDataProvider, hubFactory)
        {
        }

        protected override void PerformOperation(TriggerInput input)
        {
            var triggerKey = new TriggerKey(input.Trigger, input.Group);
            Scheduler.UnscheduleJob(triggerKey);
        }
    }
}