namespace CrystalQuartz.Application.Commands
{
    using System;
    using System.Threading.Tasks;
    using CrystalQuartz.Core.Contracts;
    using CrystalQuartz.Core.Domain.Events;
    using Inputs;

    public class StandbySchedulerCommand : AbstractOperationCommand<NoInput>
    {
        public StandbySchedulerCommand(ISchedulerHostProvider schedulerHostProvider) : base(schedulerHostProvider)
        {
        }

        protected override async Task PerformOperation(NoInput input)
        {
            await SchedulerHost.Commander.StandbyScheduler();

            RiseEvent(new RawSchedulerEvent(SchedulerEventScope.Scheduler, SchedulerEventType.Standby, null, null));
        }
    }
}