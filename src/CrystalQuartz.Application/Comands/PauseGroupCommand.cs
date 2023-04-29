using System;
using CrystalQuartz.Core.Contracts;

namespace CrystalQuartz.Application.Comands
{
    using System.Threading.Tasks;
    using CrystalQuartz.Application.Comands.Inputs;
    using CrystalQuartz.Core.Domain.Events;

    public class PauseGroupCommand : AbstractOperationCommand<GroupInput>
    {
        public PauseGroupCommand(Func<SchedulerHost> schedulerHostProvider) : base(schedulerHostProvider)
        {
        }

        protected override async Task PerformOperation(GroupInput input)
        {
            await SchedulerHost.Commander.PauseJobGroup(input.Group);

            RiseEvent(new RawSchedulerEvent(SchedulerEventScope.Group, SchedulerEventType.Paused, input.Group, null));
        }
    }
}