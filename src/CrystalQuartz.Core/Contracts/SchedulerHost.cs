using System;
using CrystalQuartz.Core.Timeline;

namespace CrystalQuartz.Core.Contracts
{
    public class SchedulerHost
    {
        public SchedulerHost(ISchedulerClerk clerk, ISchedulerCommander commander, ISchedulerEventSource eventSource, Version quartzVersion)
        {
            Clerk = clerk;
            Commander = commander;
            QuartzVersion = quartzVersion;
            EventHub = new SchedulerEventHub(eventSource);
        }

        public Version QuartzVersion { get; }

        public ISchedulerClerk Clerk { get; }

        public ISchedulerCommander Commander { get; }

        public ISchedulerEventHub EventHub { get; }
    }
}