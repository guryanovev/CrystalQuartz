using System;
using CrystalQuartz.Core.Contracts;

namespace CrystalQuartz.Application.Comands
{
    using CrystalQuartz.Application.Comands.Inputs;
    using CrystalQuartz.Core.Domain.Events;

    public class PauseGroupCommand : AbstractOperationCommand<GroupInput>
    {
        public PauseGroupCommand(Func<SchedulerHost> schedulerHostProvider) : base(schedulerHostProvider)
        {
        }

        protected override void PerformOperation(GroupInput input)
        {
            SchedulerHost.Commander.PauseJobGroup(input.Group);

            RiseEvent(new RawSchedulerEvent(SchedulerEventScope.Group, SchedulerEventType.Paused, input.Group, null));
        }
    }
}