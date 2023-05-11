namespace CrystalQuartz.Application.Commands
{
    using System;
    using System.Threading.Tasks;
    using CrystalQuartz.Core.Contracts;
    using Inputs;

    public class DeleteGroupCommand : AbstractOperationCommand<GroupInput>
    {
        public DeleteGroupCommand(ISchedulerHostProvider schedulerHostProvider) : base(schedulerHostProvider)
        {
        }

        protected override async Task PerformOperation(GroupInput input)
        {
            await SchedulerHost.Commander.DeleteJobGroup(input.Group);
        }
    }
}