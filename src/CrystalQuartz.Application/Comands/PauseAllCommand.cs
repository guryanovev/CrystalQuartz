using System;
using CrystalQuartz.Core.Contracts;

namespace CrystalQuartz.Application.Comands
{
    using CrystalQuartz.Application.Comands.Inputs;

    public class PauseAllCommand : AbstractOperationCommand<NoInput>
    {
        public PauseAllCommand(Func<SchedulerHost> schedulerHostProvider) : base(schedulerHostProvider)
        {
        }

        protected override void PerformOperation(NoInput input)
        {
            SchedulerHost.Commander.PauseAllJobs();
            
            //RiseEvent(new SchedulerEvent(SchedulerEventScope.Scheduler, SchedulerEventType.Paused, null, null)); // todo v3
        }
    }
}