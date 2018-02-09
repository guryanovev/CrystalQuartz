using System;
using CrystalQuartz.Core.Contracts;

namespace CrystalQuartz.Application.Comands
{
    using CrystalQuartz.Application.Comands.Inputs;
    using CrystalQuartz.Core.Timeline;

    public class ResumeGroupCommand : AbstractOperationCommand<GroupInput>
    {
        public ResumeGroupCommand(Func<SchedulerHost> schedulerHostProvider) : base(schedulerHostProvider)
        {
        }

        protected override void PerformOperation(GroupInput input)
        {
            SchedulerHost.Commander.ResumeJobGroup(input.Group);

            //RiseEvent(new SchedulerEvent(SchedulerEventScope.Group, SchedulerEventType.Resumed, input.Group, null)); todo v3
        }
    }
}