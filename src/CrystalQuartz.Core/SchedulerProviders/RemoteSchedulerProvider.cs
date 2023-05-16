namespace CrystalQuartz.Core.SchedulerProviders
{
    using CrystalQuartz.Core.Contracts;

    public class RemoteSchedulerProvider : ISchedulerProvider
    {
        public string SchedulerHost { get; set; }

        public object CreateScheduler(ISchedulerEngine engine)
        {
            return engine.CreateStandardRemoteScheduler(SchedulerHost);
        }
    }
}