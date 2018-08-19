namespace CrystalQuartz.Core.Services
{
    using System.Collections.Generic;
    using CrystalQuartz.Core.Domain.Events;

    public interface ISchedulerEventHub
    {
        IEnumerable<SchedulerEventData> List(int minId);
    }
}