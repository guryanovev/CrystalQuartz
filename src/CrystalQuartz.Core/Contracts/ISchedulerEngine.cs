namespace CrystalQuartz.Core.Contracts
{
    public interface ISchedulerEngine
    {
        object CreateStandardRemoteScheduler(string url);



        SchedulerServices CreateServices(object scheduler, Options options);
    }
}