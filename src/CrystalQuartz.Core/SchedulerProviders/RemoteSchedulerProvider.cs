using CrystalQuartz.Core.Contracts;

namespace CrystalQuartz.Core.SchedulerProviders
{
    public class RemoteSchedulerProvider : ISchedulerProvider
    {
        public string SchedulerHost { get; set; }

        public object CreateScheduler(ISchedulerEngine engine)
        {
            return engine.CreateStandardRemoteScheduler(SchedulerHost);
        }
    }
}