using System;
using CrystalQuartz.Core.Contracts;

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

            output.JobDetails = detailsData.JobDetails;
            output.JobDataMap = detailsData.Properties;
        }
    }
}