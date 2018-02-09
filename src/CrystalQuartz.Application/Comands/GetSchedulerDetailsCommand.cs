using System;
using CrystalQuartz.Core.Contracts;

namespace CrystalQuartz.Application.Comands
{
    using CrystalQuartz.Application.Comands.Inputs;
    using CrystalQuartz.Application.Comands.Outputs;

    public class GetSchedulerDetailsCommand : AbstractSchedulerCommand<NoInput, SchedulerDetailsOutput>
    {
        public GetSchedulerDetailsCommand(Func<SchedulerHost> schedulerHostProvider) : base(schedulerHostProvider)
        {
        }

        protected override void InternalExecute(NoInput input, SchedulerDetailsOutput output)
        {
            output.SchedulerDetails = SchedulerHost.Clerk.GetSchedulerDetails();
        }
    }
}