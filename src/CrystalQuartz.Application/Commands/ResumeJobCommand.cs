namespace CrystalQuartz.Application.Commands
{
    using System;
    using System.Threading.Tasks;
    using CrystalQuartz.Core.Contracts;
    using CrystalQuartz.Core.Domain.Events;
    using Inputs;

    public class ResumeJobCommand : AbstractOperationCommand<JobInput>
    {
        public ResumeJobCommand(SchedulerHost schedulerHostProvider) : base(schedulerHostProvider)
        {
        }

        protected override async Task PerformOperation(JobInput input)
        {
            await SchedulerHost.Commander.ResumeJob(input.Job, input.Group);

            RiseEvent(new RawSchedulerEvent(SchedulerEventScope.Job, SchedulerEventType.Resumed, input.Group + "." + input.Job, null));
        }
    }
}