using System;
using CrystalQuartz.Core.Utils;

namespace CrystalQuartz.Core.Contracts
{
    using CrystalQuartz.Core.Domain.Events;
    using CrystalQuartz.Core.Services;

    public class SchedulerHost
    {
        private readonly ISchedulerEventTarget _eventTarget;
        private readonly long _instanceMarker = DateTime.UtcNow.UnixTicks();

        public SchedulerHost(params string[] errors) : this(null, errors)
        {
        }

        public SchedulerHost(Version quartzVersion, params string[] errors)
        {
            QuartzVersion = quartzVersion;
            Errors = errors;
            Faulted = true;
        }

        public SchedulerHost(
            ISchedulerClerk clerk, 
            ISchedulerCommander commander, 
            Version quartzVersion, 
            ISchedulerEventHub eventHub, 
            ISchedulerEventTarget eventTarget)
        {
            _eventTarget = eventTarget;
            Clerk = clerk;
            Commander = commander;
            QuartzVersion = quartzVersion;
            EventHub = eventHub;
            Faulted = false;
        }

        public Version QuartzVersion { get; }

        public ISchedulerClerk Clerk { get; }

        public ISchedulerCommander Commander { get; }

        public ISchedulerEventHub EventHub { get; }

        public bool Faulted { get; }

        public string[] Errors { get; }

        public long InstanceMarker
        {
            get { return _instanceMarker; }
        }

        public void RaiseEvent(SchedulerEvent @event)
        {
            _eventTarget.Push(@event);
        }
    }
}