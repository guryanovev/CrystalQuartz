namespace CrystalQuartz.Application.Commands
{
    using System;
    using System.Threading.Tasks;
    using CrystalQuartz.Core.Contracts;
    using Inputs;

    public class ExecuteNowCommand : AbstractOperationCommand<JobInput>
    {
        public ExecuteNowCommand(Func<SchedulerHost> schedulerHostProvider) : base(schedulerHostProvider)
        {
        }

        protected override async Task PerformOperation(JobInput input)
        {
            await SchedulerHost.Commander.ExecuteNow(input.Job, input.Group);
        }
    }
}