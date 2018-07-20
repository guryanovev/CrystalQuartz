using CrystalQuartz.Core.Contracts;

namespace CrystalQuartz.Core.SchedulerProviders
{
    public interface ISchedulerProvider
    {
        object CreateScheduler(ISchedulerEngine engine);
    }
}