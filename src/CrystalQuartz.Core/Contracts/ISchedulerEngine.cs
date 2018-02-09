namespace CrystalQuartz.Core.Contracts
{
    public interface ISchedulerEngine
    {
        object CreateStandardRemoteScheduler(string url);

        SchedulerHost CreateHost(object scheduler, Options options);
    }
}