namespace CrystalQuartz.Core.Contracts
{
    using System;
    using CrystalQuartz.Core.Domain.Events;

    public class SchedulerEventArgs : EventArgs
    {
        public SchedulerEventArgs(RawSchedulerEvent payload)
        {
            Payload = payload;
        }

        public RawSchedulerEvent Payload { get; }
    }
}