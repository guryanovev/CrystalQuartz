using System;
using CrystalQuartz.Core.Contracts;

namespace CrystalQuartz.Application.Comands
{
    using CrystalQuartz.Application.Comands.Inputs;

    public class DeleteJobCommand : AbstractOperationCommand<JobInput>
    {
        public DeleteJobCommand(Func<SchedulerHost> schedulerHostProvider) : base(schedulerHostProvider)
        {
        }

        protected override void PerformOperation(JobInput input)
        {
            SchedulerHost.Commander.DeleteJob(input.Job, input.Group);
        }
    }
}