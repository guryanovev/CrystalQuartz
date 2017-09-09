namespace CrystalQuartz.Application.Comands
{
    using CrystalQuartz.Application.Comands.Inputs;
    using CrystalQuartz.Core;
    using CrystalQuartz.Core.SchedulerProviders;
    using CrystalQuartz.Core.Timeline;

    public class StopSchedulerCommand : AbstractOperationCommand<NoInput>
    {
        public StopSchedulerCommand(ISchedulerProvider schedulerProvider, ISchedulerDataProvider schedulerDataProvider, SchedulerHubFactory hubFactory) : base(schedulerProvider, schedulerDataProvider, hubFactory)
        {
        }

        protected override void PerformOperation(NoInput input)
        {
            Scheduler.Shutdown(false);
            RiseEvent(new SchedulerEvent(SchedulerEventScope.Scheduler, SchedulerEventType.Shutdown, null, null));
        }
    }
}