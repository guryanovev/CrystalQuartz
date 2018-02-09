using System;
using CrystalQuartz.Core.Timeline;

namespace CrystalQuartz.Core.Contracts
{
    public class SchedulerEventArgs : EventArgs
    {
        public SchedulerEventArgs(SchedulerEvent payload)
        {
            Payload = payload;
        }

        public SchedulerEvent Payload { get; }
    }

    public interface ISchedulerEventSource
    {
        event EventHandler<SchedulerEventArgs> EventEmitted;
    }
}