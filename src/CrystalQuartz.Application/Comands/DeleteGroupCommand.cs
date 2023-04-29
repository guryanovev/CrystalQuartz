using System;
using CrystalQuartz.Core.Contracts;

namespace CrystalQuartz.Application.Comands
{
    using System.Threading.Tasks;
    using CrystalQuartz.Application.Comands.Inputs;

    public class DeleteGroupCommand : AbstractOperationCommand<GroupInput>
    {
        public DeleteGroupCommand(Func<SchedulerHost> schedulerHostProvider) : base(schedulerHostProvider)
        {
        }

        protected override async Task PerformOperation(GroupInput input)
        {
            await SchedulerHost.Commander.DeleteJobGroup(input.Group);
        }
    }
}