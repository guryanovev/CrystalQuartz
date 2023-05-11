namespace CrystalQuartz.Application.Commands
{
    using System;
    using System.Threading.Tasks;
    using CrystalQuartz.Core.Contracts;
    using Inputs;

    public class GetDataCommand : AbstractOperationCommand<NoInput>
    {
        public GetDataCommand(ISchedulerHostProvider schedulerHostProvider) : base(schedulerHostProvider)
        {
        }

        protected override Task PerformOperation(NoInput input)
        {
            return AsyncUtils.CompletedTask();
        }
    }
}