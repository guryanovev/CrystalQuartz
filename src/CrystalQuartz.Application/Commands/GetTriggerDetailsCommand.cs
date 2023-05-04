namespace CrystalQuartz.Application.Commands
{
    using System;
    using System.Threading.Tasks;
    using CrystalQuartz.Core.Contracts;
    using CrystalQuartz.Core.Domain;
    using CrystalQuartz.Core.Domain.ObjectTraversing;
    using Inputs;
    using Outputs;

    public class GetTriggerDetailsCommand : AbstractSchedulerCommand<TriggerInput, TriggerDetailsOutput>
    {
        private readonly TraversingOptions _jobDataMapTraversingOptions;

        public GetTriggerDetailsCommand(
            SchedulerHost schedulerHostProvider,
            TraversingOptions jobDataMapTraversingOptions) : base(schedulerHostProvider)
        {
            _jobDataMapTraversingOptions = jobDataMapTraversingOptions;
        }

        protected override async Task InternalExecute(TriggerInput input, TriggerDetailsOutput output)
        {
            TriggerDetailsData detailsData = await SchedulerHost.Clerk.GetTriggerDetailsData(input.Trigger, input.Group);
            var objectTraverser = new ObjectTraverser(_jobDataMapTraversingOptions);

            output.JobDataMap = objectTraverser.Traverse(detailsData.JobDataMap);
            output.TriggerData = detailsData.PrimaryTriggerData;
            output.TriggerSecondaryData = detailsData.SecondaryTriggerData;
        }
    }
}