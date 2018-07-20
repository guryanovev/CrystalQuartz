using System;
using CrystalQuartz.Core.Contracts;

namespace CrystalQuartz.Application.Comands
{
    using CrystalQuartz.Application.Comands.Inputs;

    public class DeleteTriggerCommand : AbstractOperationCommand<TriggerInput>
    {
        public DeleteTriggerCommand(Func<SchedulerHost> schedulerHostProvider) : base(schedulerHostProvider)
        {
        }

        protected override void PerformOperation(TriggerInput input)
        {
            SchedulerHost.Commander.DeleteTrigger(input.Trigger, input.Group);
        }
    }
}