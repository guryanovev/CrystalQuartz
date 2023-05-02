namespace CrystalQuartz.Application.Commands.Outputs
{
    using CrystalQuartz.Core.Domain;
    using CrystalQuartz.Core.Domain.ObjectTraversing;
    using CrystalQuartz.WebFramework.Commands;

    public class JobDetailsOutput : CommandResult
    {
        public PropertyValue JobDataMap { get; set; }

        public JobDetails JobDetails { get; set; }
    }
}