using System;
using CrystalQuartz.Core.Contracts;

namespace CrystalQuartz.Application.Comands
{
    using System.Threading.Tasks;
    using CrystalQuartz.Application.Comands.Inputs;

    public class PauseTriggerCommand : AbstractOperationCommand<TriggerInput>
    {
        public PauseTriggerCommand(Func<SchedulerHost> schedulerHostProvider) : base(schedulerHostProvider)
        {
        }

        protected override async Task PerformOperation(TriggerInput input)
        {
            await SchedulerHost.Commander.PauseTrigger(input.Trigger, input.Group);
        }
    }
}