using System;
using CrystalQuartz.Core.Contracts;

namespace CrystalQuartz.Application.Comands
{
    using System.Threading.Tasks;
    using CrystalQuartz.Application.Comands.Inputs;
    using CrystalQuartz.Core.Domain.Events;

    public class PauseJobCommand : AbstractOperationCommand<JobInput>
    {
        public PauseJobCommand(Func<SchedulerHost> schedulerHostProvider) : base(schedulerHostProvider)
        {
        }

        protected override async Task PerformOperation(JobInput input)
        {
            await SchedulerHost.Commander.PauseJob(input.Job, input.Group);
            
            RiseEvent(new RawSchedulerEvent(SchedulerEventScope.Job, SchedulerEventType.Paused, string.Format("{0}.{1}", input.Group, input.Job), null)); 
        }
    }
}