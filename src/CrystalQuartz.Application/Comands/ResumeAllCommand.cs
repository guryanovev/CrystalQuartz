using System;
using CrystalQuartz.Core.Contracts;

namespace CrystalQuartz.Application.Comands
{
    using System.Threading.Tasks;
    using CrystalQuartz.Application.Comands.Inputs;
    using CrystalQuartz.Core.Domain.Events;

    public class ResumeAllCommand : AbstractOperationCommand<NoInput>
    {
        public ResumeAllCommand(Func<SchedulerHost> schedulerHostProvider) : base(schedulerHostProvider)
        {
        }

        protected override async Task PerformOperation(NoInput input)
        {
            await SchedulerHost.Commander.ResumeAllJobs();
            
            RiseEvent(new RawSchedulerEvent(SchedulerEventScope.Scheduler, SchedulerEventType.Resumed, null, null));
        }
    }
}