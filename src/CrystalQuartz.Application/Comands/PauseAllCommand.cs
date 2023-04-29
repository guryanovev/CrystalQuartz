using System;
using CrystalQuartz.Core.Contracts;

namespace CrystalQuartz.Application.Comands
{
    using System.Threading.Tasks;
    using CrystalQuartz.Application.Comands.Inputs;
    using CrystalQuartz.Core.Domain.Events;

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