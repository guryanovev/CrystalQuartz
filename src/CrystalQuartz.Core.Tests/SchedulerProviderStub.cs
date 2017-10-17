namespace CrystalQuartz.Core.Tests
{
    using Quartz;
    using SchedulerProviders;

    public class SchedulerProviderStub : ISchedulerProvider
    {
        public SchedulerProviderStub(IScheduler scheduler)
        {
            Scheduler = scheduler;
        }

        public SchedulerProviderStub()
        {
        }

        public Task Init()
        {
        }

        public IScheduler Scheduler
        {
            get; set;
        }
    }
}