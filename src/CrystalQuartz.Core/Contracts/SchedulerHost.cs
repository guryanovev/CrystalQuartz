namespace CrystalQuartz.Core.Contracts
{
    using System;
    using CrystalQuartz.Core.Domain.Events;
    using CrystalQuartz.Core.Services;
    using CrystalQuartz.Core.Utils;

    public abstract class SchedulerHost
    {
        protected SchedulerHost(Version? quartzVersion)
        {
            QuartzVersion = quartzVersion;
        }

        public Version? QuartzVersion { get; }

        public abstract ISchedulerClerk Clerk { get; }

        public abstract ISchedulerCommander Commander { get; }

        public abstract ISchedulerEventHub EventHub { get; }

        public abstract IAllowedJobTypesRegistry AllowedJobTypesRegistry { get; }

        public abstract bool Faulted { get; }

        public abstract string[]? Errors { get; }

        public long InstanceMarker { get; } = DateTime.UtcNow.UnixTicks();

        public abstract void RaiseEvent(RawSchedulerEvent @event);
    }
}