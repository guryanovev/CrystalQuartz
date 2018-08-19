using System;
using CrystalQuartz.Core.Contracts;

namespace CrystalQuartz.Application.Comands
{
    using CrystalQuartz.Application.Comands.Inputs;
    using CrystalQuartz.Core.Domain.Events;

    public class StandbySchedulerCommand : AbstractOperationCommand<NoInput>
    {
        public StandbySchedulerCommand(Func<SchedulerHost> schedulerHostProvider) : base(schedulerHostProvider)
        {
        }

        protected override void PerformOperation(NoInput input)
        {
            SchedulerHost.Commander.StandbyScheduler();

            RiseEvent(new SchedulerEvent(SchedulerEventScope.Scheduler, SchedulerEventType.Standby, null, null));
        }
    }
}