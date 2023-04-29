using System;
using CrystalQuartz.Core.Contracts;

namespace CrystalQuartz.Application.Comands
{
    using System.Threading.Tasks;
    using CrystalQuartz.Application.Comands.Inputs;
    using CrystalQuartz.Core.Domain.Events;

    public class StandbySchedulerCommand : AbstractOperationCommand<NoInput>
    {
        public StandbySchedulerCommand(Func<SchedulerHost> schedulerHostProvider) : base(schedulerHostProvider)
        {
        }

        protected override async Task PerformOperation(NoInput input)
        {
            await SchedulerHost.Commander.StandbyScheduler();

            RiseEvent(new RawSchedulerEvent(SchedulerEventScope.Scheduler, SchedulerEventType.Standby, null, null));
        }
    }
}