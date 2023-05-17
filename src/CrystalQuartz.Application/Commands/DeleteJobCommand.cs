namespace CrystalQuartz.Application.Commands
{
    using System.Threading.Tasks;
    using Inputs;

    public class DeleteJobCommand : AbstractOperationCommand<JobInput>
    {
        public DeleteJobCommand(ISchedulerHostProvider schedulerHostProvider) : base(schedulerHostProvider)
        {
        }

        protected override async Task PerformOperation(JobInput input)
        {
            await SchedulerHost.Commander.DeleteJob(input.Job, input.Group);
        }
    }
}