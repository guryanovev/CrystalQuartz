﻿namespace CrystalQuartz.Application.Commands
{
    using System.Threading.Tasks;
    using CrystalQuartz.Core.Domain.Events;
    using Inputs;

    public class ResumeGroupCommand : AbstractOperationCommand<GroupInput>
    {
        public ResumeGroupCommand(ISchedulerHostProvider schedulerHostProvider) : base(schedulerHostProvider)
        {
        }

        protected override async Task PerformOperation(GroupInput input)
        {
            await SchedulerHost.Commander.ResumeJobGroup(input.Group);

            RiseEvent(new RawSchedulerEvent(SchedulerEventScope.Group, SchedulerEventType.Resumed, input.Group, null));
        }
    }
}