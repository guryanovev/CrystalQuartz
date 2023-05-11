namespace CrystalQuartz.Application.Commands
{
    using System;
    using System.Threading.Tasks;
    using CrystalQuartz.Core.Contracts;
    using Inputs;
    using Outputs;

    public class GetSchedulerDetailsCommand : AbstractSchedulerCommand<NoInput, SchedulerDetailsOutput>
    {
        public GetSchedulerDetailsCommand(ISchedulerHostProvider schedulerHostProvider) : base(schedulerHostProvider)
        {
        }

        protected override async Task InternalExecute(NoInput input, SchedulerDetailsOutput output)
        {
            output.SchedulerDetails = await SchedulerHost.Clerk.GetSchedulerDetails();
        }
    }
}