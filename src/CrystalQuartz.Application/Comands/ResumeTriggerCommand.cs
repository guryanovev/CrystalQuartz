using System;
using CrystalQuartz.Core.Contracts;

namespace CrystalQuartz.Application.Comands
{
    using CrystalQuartz.Application.Comands.Inputs;

    public class ResumeTriggerCommand : AbstractOperationCommand<TriggerInput>
    {
        public ResumeTriggerCommand(Func<SchedulerHost> schedulerHostProvider) : base(schedulerHostProvider)
        {
        }

        protected override void PerformOperation(TriggerInput input)
        {
            SchedulerHost.Commander.ResumeTrigger(input.Trigger, input.Group);
        }
    }
}