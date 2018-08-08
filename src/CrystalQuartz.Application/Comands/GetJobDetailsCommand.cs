using System;
using CrystalQuartz.Core.Contracts;
using CrystalQuartz.Core.Domain.ObjectTraversing;

namespace CrystalQuartz.Application.Comands
{
    using CrystalQuartz.Application.Comands.Inputs;
    using CrystalQuartz.Application.Comands.Outputs;

    public class GetJobDetailsCommand : AbstractSchedulerCommand<JobInput, JobDetailsOutput>
    {
        public GetJobDetailsCommand(Func<SchedulerHost> schedulerHostProvider) : base(schedulerHostProvider)
        {
        }

        protected override void InternalExecute(JobInput input, JobDetailsOutput output)
        {
            var detailsData = SchedulerHost.Clerk.GetJobDetailsData(input.Job, input.Group);
            var objectTraverser = new ObjectTraverser();
            
            output.JobDetails = detailsData.JobDetails;
            output.JobDataMap = objectTraverser.Traverse(detailsData.JobDataMap);
        }
    }
}