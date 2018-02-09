using System;
using CrystalQuartz.Core.Contracts;

namespace CrystalQuartz.Application.Comands
{
    using CrystalQuartz.Application.Comands.Inputs;
    using CrystalQuartz.Core.Timeline;

    public class ResumeAllCommand : AbstractOperationCommand<NoInput>
    {
        public ResumeAllCommand(Func<SchedulerHost> schedulerHostProvider) : base(schedulerHostProvider)
        {
        }

        protected override void PerformOperation(NoInput input)
        {
            SchedulerHost.Commander.ResumeAllJobs();
            //RiseEvent(new SchedulerEvent(SchedulerEventScope.Scheduler, SchedulerEventType.Resumed, null, null)); todo v3
        }
    }
}