using System;

namespace CrystalQuartz.Core.Contracts
{
    using CrystalQuartz.Core.Domain.Events;

    public class SchedulerEventArgs : EventArgs
    {
        public SchedulerEventArgs(RawSchedulerEvent payload)
        {
            Payload = payload;
        }

        public RawSchedulerEvent Payload { get; }
    }

    public interface ISchedulerEventSource
    {
        event EventHandler<SchedulerEventArgs> EventEmitted;
    }
}