namespace CrystalQuartz.Core.SchedulerProviders
{
    using CrystalQuartz.Core.Contracts;

    public interface ISchedulerProvider
    {
        object CreateScheduler(ISchedulerEngine engine);
    }
}