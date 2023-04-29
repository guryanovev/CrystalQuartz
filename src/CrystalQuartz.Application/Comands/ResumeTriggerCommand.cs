using System;
using CrystalQuartz.Core.Contracts;

namespace CrystalQuartz.Application.Comands
{
    using System.Threading.Tasks;
    using CrystalQuartz.Application.Comands.Inputs;

    public class ResumeTriggerCommand : AbstractOperationCommand<TriggerInput>
    {
        public ResumeTriggerCommand(Func<SchedulerHost> schedulerHostProvider) : base(schedulerHostProvider)
        {
        }

        protected override async Task PerformOperation(TriggerInput input)
        {
            await SchedulerHost.Commander.ResumeTrigger(input.Trigger, input.Group);
        }
    }
}