namespace CrystalQuartz.Application.Commands
{
    using System.Threading.Tasks;
    using Inputs;

    public class ExecuteNowCommand : AbstractOperationCommand<JobInput>
    {
        public ExecuteNowCommand(ISchedulerHostProvider schedulerHostProvider) : base(schedulerHostProvider)
        {
        }

        protected override async Task PerformOperation(JobInput input)
        {
            await SchedulerHost.Commander.ExecuteNow(input.Job, input.Group);
        }
    }
}