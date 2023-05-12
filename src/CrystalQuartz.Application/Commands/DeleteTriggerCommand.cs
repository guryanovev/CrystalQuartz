namespace CrystalQuartz.Application.Commands
{
    using System.Threading.Tasks;
    using Inputs;

    public class DeleteTriggerCommand : AbstractOperationCommand<TriggerInput>
    {
        public DeleteTriggerCommand(ISchedulerHostProvider schedulerHostProvider) : base(schedulerHostProvider)
        {
        }

        protected override async Task PerformOperation(TriggerInput input)
        {
            await SchedulerHost.Commander.DeleteTrigger(input.Trigger, input.Group);
        }
    }
}