namespace CrystalQuartz.Application.Commands.Outputs
{
    using CrystalQuartz.Core.Domain;
    using CrystalQuartz.Core.Domain.Activities;
    using CrystalQuartz.Core.Domain.ObjectTraversing;
    using CrystalQuartz.WebFramework.Commands;

    public class TriggerDetailsOutput : CommandResult
    {
        public TriggerData? TriggerData { get; set; }

        public TriggerSecondaryData? TriggerSecondaryData { get; set; }

        public PropertyValue? JobDataMap { get; set; }
    }
}