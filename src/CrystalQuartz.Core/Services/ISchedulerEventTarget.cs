namespace CrystalQuartz.Core.Services
{
    using CrystalQuartz.Core.Domain.Events;

    public interface ISchedulerEventTarget
    {
        void Push(RawSchedulerEvent @event);
    }
}