using System;
using CrystalQuartz.Core.Contracts;

namespace CrystalQuartz.Application.Comands
{
    using CrystalQuartz.Application.Comands.Inputs;
    using CrystalQuartz.Core.Domain.Events;

    public class PauseJobCommand : AbstractOperationCommand<JobInput>
    {
        public PauseJobCommand(Func<SchedulerHost> schedulerHostProvider) : base(schedulerHostProvider)
        {
        }

        protected override void PerformOperation(JobInput input)
        {
            SchedulerHost.Commander.PauseJob(input.Job, input.Group);
            
            RiseEvent(new RawSchedulerEvent(SchedulerEventScope.Job, SchedulerEventType.Paused, string.Format("{0}.{1}", input.Group, input.Job), null)); 
        }
    }
}