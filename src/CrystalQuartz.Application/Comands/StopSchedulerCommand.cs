using System;
using CrystalQuartz.Core.Contracts;

namespace CrystalQuartz.Application.Comands
{
    using CrystalQuartz.Application.Comands.Inputs;
    using CrystalQuartz.Core.Timeline;

    public class StopSchedulerCommand : AbstractOperationCommand<NoInput>
    {
        public StopSchedulerCommand(Func<SchedulerHost> schedulerHostProvider) : base(schedulerHostProvider)
        {
        }

        protected override void PerformOperation(NoInput input)
        {
            SchedulerHost.Commander.StopScheduler();

            RiseEvent(new SchedulerEvent(SchedulerEventScope.Scheduler, SchedulerEventType.Shutdown, null, null));
        }
    }
}