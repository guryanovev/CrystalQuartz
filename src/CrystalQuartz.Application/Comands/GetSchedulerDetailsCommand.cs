using System;
using CrystalQuartz.Core.Contracts;

namespace CrystalQuartz.Application.Comands
{
    using System.Threading.Tasks;
    using CrystalQuartz.Application.Comands.Inputs;
    using CrystalQuartz.Application.Comands.Outputs;

    public class GetSchedulerDetailsCommand : AbstractSchedulerCommand<NoInput, SchedulerDetailsOutput>
    {
        public GetSchedulerDetailsCommand(Func<SchedulerHost> schedulerHostProvider) : base(schedulerHostProvider)
        {
        }

        protected override async Task InternalExecute(NoInput input, SchedulerDetailsOutput output)
        {
            output.SchedulerDetails = await SchedulerHost.Clerk.GetSchedulerDetails();
        }
    }
}