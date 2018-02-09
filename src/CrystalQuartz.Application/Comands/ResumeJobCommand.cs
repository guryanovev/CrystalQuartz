using System;
using CrystalQuartz.Core.Contracts;

namespace CrystalQuartz.Application.Comands
{
    using CrystalQuartz.Application.Comands.Inputs;
    using CrystalQuartz.Core.Timeline;

    public class ResumeJobCommand : AbstractOperationCommand<JobInput>
    {
        public ResumeJobCommand(Func<SchedulerHost> schedulerHostProvider) : base(schedulerHostProvider)
        {
        }

        protected override void PerformOperation(JobInput input)
        {
            SchedulerHost.Commander.ResumeJob(input.Job, input.Group);

            //RiseEvent(new SchedulerEvent(SchedulerEventScope.Job, SchedulerEventType.Resumed, key.ToString(), null)); todo v3
        }
    }
}