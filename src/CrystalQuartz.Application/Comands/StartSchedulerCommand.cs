using System;
using CrystalQuartz.Core.Contracts;

namespace CrystalQuartz.Application.Comands
{
    using CrystalQuartz.Application.Comands.Inputs;
    using CrystalQuartz.Core.Domain.Events;

    public class StartSchedulerCommand : AbstractOperationCommand<NoInput>
    {
        public StartSchedulerCommand(Func<SchedulerHost> schedulerHostProvider) : base(schedulerHostProvider)
        {
        }

        protected override void PerformOperation(NoInput input)
        {
            SchedulerHost.Commander.StartScheduler();

            RiseEvent(new RawSchedulerEvent(SchedulerEventScope.Scheduler, SchedulerEventType.Resumed, null, null));
        }
    }
}