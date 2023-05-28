namespace CrystalQuartz.Core.Contracts
{
    using System;
    using CrystalQuartz.Core.Domain.Events;
    using CrystalQuartz.Core.Services;

    public class FaultedSchedulerHost : SchedulerHost
    {
        public FaultedSchedulerHost(Version? quartzVersion, string[]? errors)
            : base(quartzVersion)
        {
            Errors = errors;
        }

        public override ISchedulerClerk Clerk => throw new Exception("Faulted scheduler host cannot provide scheduler clerk");

        public override ISchedulerCommander Commander => throw new Exception("Faulted scheduler host cannot provide scheduler commander");

        public override ISchedulerEventHub EventHub => throw new Exception("Faulted scheduler host cannot provide event hub");

        public override IAllowedJobTypesRegistry AllowedJobTypesRegistry => throw new Exception("Faulted scheduler host cannot provide allowed job types");

        public override bool Faulted => true;

        public override string[]? Errors { get; }

        public override void RaiseEvent(RawSchedulerEvent @event)
        {
        }
    }
}