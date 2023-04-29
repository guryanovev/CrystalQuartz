using System;
using CrystalQuartz.Core.Contracts;

namespace CrystalQuartz.Application.Comands
{
    using System.Threading.Tasks;
    using CrystalQuartz.Application.Comands.Inputs;

    public class DeleteTriggerCommand : AbstractOperationCommand<TriggerInput>
    {
        public DeleteTriggerCommand(Func<SchedulerHost> schedulerHostProvider) : base(schedulerHostProvider)
        {
        }

        protected override async Task PerformOperation(TriggerInput input)
        {
            await SchedulerHost.Commander.DeleteTrigger(input.Trigger, input.Group);
        }
    }
}