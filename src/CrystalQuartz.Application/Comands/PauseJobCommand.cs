using System;
using CrystalQuartz.Core.Contracts;

namespace CrystalQuartz.Application.Comands
{
    using CrystalQuartz.Application.Comands.Inputs;
    using CrystalQuartz.Core.Timeline;

    public class PauseJobCommand : AbstractOperationCommand<JobInput>
    {
        public PauseJobCommand(Func<SchedulerHost> schedulerHostProvider) : base(schedulerHostProvider)
        {
        }

        protected override void PerformOperation(JobInput input)
        {
            SchedulerHost.Commander.PauseJob(input.Job, input.Group);
            

            //RiseEvent(new SchedulerEvent(SchedulerEventScope.Job, SchedulerEventType.Paused, key.ToString(), null)); todo v3
        }
    }
}