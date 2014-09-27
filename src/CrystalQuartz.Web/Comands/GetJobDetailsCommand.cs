namespace CrystalQuartz.Web.Comands
{
    using System.Linq;
    using CrystalQuartz.Core;
    using CrystalQuartz.Core.SchedulerProviders;
    using CrystalQuartz.Web.Comands.Inputs;
    using CrystalQuartz.Web.Comands.Outputs;

    public class GetJobDetailsCommand : AbstractSchedulerCommand<JobInput, JobDetailsOutput>
    {
        public GetJobDetailsCommand(ISchedulerProvider schedulerProvider, ISchedulerDataProvider schedulerDataProvider) : base(schedulerProvider, schedulerDataProvider)
        {
        }

        protected override void InternalExecute(JobInput input, JobDetailsOutput output)
        {
            var detailsData = SchedulerDataProvider.GetJobDetailsData(input.Job, input.Group);

            output.JobDataMap = detailsData
                .JobDataMap
                .Select(pair => new Property(pair.Key.ToString(), pair.Value))
                .ToArray();

            output.JobProperties = detailsData
                .JobProperties
                .Select(pair => new Property(pair.Key, pair.Value))
                .ToArray();
        }
    }
}