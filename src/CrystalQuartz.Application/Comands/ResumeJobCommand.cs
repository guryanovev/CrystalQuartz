using System;
using CrystalQuartz.Core.Contracts;

namespace CrystalQuartz.Application.Comands
{
    using System.Threading.Tasks;
    using CrystalQuartz.Application.Comands.Inputs;
    using CrystalQuartz.Core.Domain.Events;

    public class ResumeJobCommand : AbstractOperationCommand<JobInput>
    {
        public ResumeJobCommand(Func<SchedulerHost> schedulerHostProvider) : base(schedulerHostProvider)
        {
        }

        protected override async Task PerformOperation(JobInput input)
        {
            await SchedulerHost.Commander.ResumeJob(input.Job, input.Group);

            RiseEvent(new RawSchedulerEvent(SchedulerEventScope.Job, SchedulerEventType.Resumed, input.Group + "." + input.Job, null));
        }
    }
}