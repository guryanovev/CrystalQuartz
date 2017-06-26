namespace CrystalQuartz.Application.Comands.Outputs
{
    using CrystalQuartz.Core.Domain;

    public class JobDetailsOutput : CommandResultWithErrorDetails
    {
        public Property[] JobDataMap { get; set; }

        //public Property[] JobProperties { get; set; }

        public JobDetails JobDetails { get; set; }
    }
}