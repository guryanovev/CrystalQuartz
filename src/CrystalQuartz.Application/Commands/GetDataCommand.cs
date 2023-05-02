namespace CrystalQuartz.Application.Commands
{
    using System;
    using System.Threading.Tasks;
    using CrystalQuartz.Core.Contracts;
    using Inputs;

    public class GetDataCommand : AbstractOperationCommand<NoInput>
    {
        public GetDataCommand(Func<SchedulerHost> schedulerHostProvider) : base(schedulerHostProvider)
        {
        }

        protected override Task PerformOperation(NoInput input)
        {
            return AsyncUtils.CompletedTask();
        }
    }
}