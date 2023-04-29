using System;
using CrystalQuartz.Core.Contracts;

namespace CrystalQuartz.Application.Comands
{
    using System.Threading.Tasks;
    using CrystalQuartz.Application.Comands.Inputs;

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