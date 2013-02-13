namespace CrystalQuartz.Core.Tests.DefaultDataProviderTests
{
    using Quartz;
    using Rhino.Mocks;

    public class DefaultDataProviderTestsBase : MockSupportTests
    {
        protected IScheduler _scheduler;

        protected DefaultSchedulerDataProvider _provider;

        protected override void InternalInit()
        {
            _scheduler = MockRepository.GenerateStub<IScheduler>();
            var schedulerProvider = new SchedulerProviderStub(_scheduler);
            _provider = new DefaultSchedulerDataProvider(schedulerProvider);
        }
    }
}