namespace CrystalQuartz.Application.Commands
{
    using System.Threading.Tasks;
    using Inputs;

    public class ResumeTriggerCommand : AbstractOperationCommand<TriggerInput>
    {
        public ResumeTriggerCommand(ISchedulerHostProvider schedulerHostProvider) : base(schedulerHostProvider)
        {
        }

        protected override async Task PerformOperation(TriggerInput input)
        {
            await SchedulerHost.Commander.ResumeTrigger(input.Trigger, input.Group);
        }
    }
}