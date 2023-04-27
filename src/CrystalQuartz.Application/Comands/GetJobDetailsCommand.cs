namespace CrystalQuartz.Application.Comands
{
    using System;
    using System.Threading.Tasks;
    using CrystalQuartz.Core.Contracts;
    using CrystalQuartz.Core.Domain.ObjectTraversing;
    using CrystalQuartz.Application.Comands.Inputs;
    using CrystalQuartz.Application.Comands.Outputs;

    public class GetJobDetailsCommand : AbstractSchedulerCommand<JobInput, JobDetailsOutput>
    {
        private readonly TraversingOptions _jobDataMapTraversingOptions;

        public GetJobDetailsCommand(
            Func<SchedulerHost> schedulerHostProvider,
            TraversingOptions jobDataMapTraversingOptions) : base(schedulerHostProvider)
        {
            _jobDataMapTraversingOptions = jobDataMapTraversingOptions;
        }

        protected override async Task InternalExecute(JobInput input, JobDetailsOutput output)
        {
            var detailsData = SchedulerHost.Clerk.GetJobDetailsData(input.Job, input.Group);
            var objectTraverser = new ObjectTraverser(_jobDataMapTraversingOptions);
            
            output.JobDetails = detailsData.JobDetails;
            output.JobDataMap = objectTraverser.Traverse(detailsData.JobDataMap);
        }
    }
}