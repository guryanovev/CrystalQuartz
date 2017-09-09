namespace CrystalQuartz.Application.Comands
{
    using CrystalQuartz.Application.Comands.Inputs;
    using CrystalQuartz.Core;
    using CrystalQuartz.Core.SchedulerProviders;
    using CrystalQuartz.Core.Timeline;

    public class StandbySchedulerCommand : AbstractOperationCommand<NoInput>
    {
        public StandbySchedulerCommand(ISchedulerProvider schedulerProvider, ISchedulerDataProvider schedulerDataProvider, SchedulerHubFactory hubFactory) : base(schedulerProvider, schedulerDataProvider, hubFactory)
        {
        }

        protected override void PerformOperation(NoInput input)
        {
            Scheduler.Standby();

            RiseEvent(new SchedulerEvent(SchedulerEventScope.Scheduler, SchedulerEventType.Standby, null, null));
        }
    }
}