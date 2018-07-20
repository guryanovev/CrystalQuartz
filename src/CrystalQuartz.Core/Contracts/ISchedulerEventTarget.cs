using CrystalQuartz.Core.Timeline;

namespace CrystalQuartz.Core.Contracts
{
    public interface ISchedulerEventTarget
    {
        void Push(SchedulerEvent @event);
    }
}