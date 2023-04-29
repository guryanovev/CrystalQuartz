using System;
using CrystalQuartz.Core.Contracts;

namespace CrystalQuartz.Application.Comands
{
    using System.Threading.Tasks;
    using CrystalQuartz.Application.Comands.Inputs;
    using CrystalQuartz.Core.Domain.Events;

    public class ResumeGroupCommand : AbstractOperationCommand<GroupInput>
    {
        public ResumeGroupCommand(Func<SchedulerHost> schedulerHostProvider) : base(schedulerHostProvider)
        {
        }

        protected override async Task PerformOperation(GroupInput input)
        {
            await SchedulerHost.Commander.ResumeJobGroup(input.Group);

            RiseEvent(new RawSchedulerEvent(SchedulerEventScope.Group, SchedulerEventType.Resumed, input.Group, null));
        }
    }
}