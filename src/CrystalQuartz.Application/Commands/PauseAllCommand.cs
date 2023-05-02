namespace CrystalQuartz.Application.Commands
{
    using System;
    using System.Threading.Tasks;
    using CrystalQuartz.Core.Contracts;
    using CrystalQuartz.Core.Domain.Events;
    using Inputs;

    public class PauseAllCommand : AbstractOperationCommand<NoInput>
    {
        public PauseAllCommand(Func<SchedulerHost> schedulerHostProvider) : base(schedulerHostProvider)
        {
        }

        protected override async Task PerformOperation(NoInput input)
        {
            await SchedulerHost.Commander.PauseAllJobs();
            
            RiseEvent(new RawSchedulerEvent(SchedulerEventScope.Scheduler, SchedulerEventType.Paused, null, null));
        }
    }
}