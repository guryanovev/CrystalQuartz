namespace CrystalQuartz.Core.Contracts
{
    using System;

    public interface ISchedulerEventSource
    {
        event EventHandler<SchedulerEventArgs> EventEmitted;
    }
}