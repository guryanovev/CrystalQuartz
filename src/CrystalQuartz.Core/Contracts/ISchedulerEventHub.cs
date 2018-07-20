using System.Collections.Generic;
using CrystalQuartz.Core.Timeline;

namespace CrystalQuartz.Core.Contracts
{
    public interface ISchedulerEventHub
    {
        IEnumerable<SchedulerEventData> List(int minId);
    }
}