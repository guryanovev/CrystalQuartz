namespace CrystalQuartz.Application.Commands
{
    using System.Threading.Tasks;
    using Inputs;

    public class PauseTriggerCommand : AbstractOperationCommand<TriggerInput>
    {
        public PauseTriggerCommand(ISchedulerHostProvider schedulerHost) : base(schedulerHost)
        {
        }

        protected override async Task PerformOperation(TriggerInput input)
        {
            await SchedulerHost.Commander.PauseTrigger(input.Trigger, input.Group);
        }
    }
}