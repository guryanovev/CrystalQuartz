using System;
using CrystalQuartz.Core.Contracts;

namespace CrystalQuartz.Application.Comands
{
    using CrystalQuartz.Application.Comands.Inputs;
    using CrystalQuartz.Core.Domain.Events;

    public class ResumeAllCommand : AbstractOperationCommand<NoInput>
    {
        public ResumeAllCommand(Func<SchedulerHost> schedulerHostProvider) : base(schedulerHostProvider)
        {
        }

        protected override void PerformOperation(NoInput input)
        {
            SchedulerHost.Commander.ResumeAllJobs();
            RiseEvent(new RawSchedulerEvent(SchedulerEventScope.Scheduler, SchedulerEventType.Resumed, null, null));
        }
    }
}