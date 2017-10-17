using System.Threading.Tasks;

namespace CrystalQuartz.Core.Tests
{
    using Quartz;
    using SchedulerProviders;

    public class SchedulerProviderStub : ISchedulerProvider
    {
        private IScheduler _stub;
        public SchedulerProviderStub(IScheduler scheduler)
        {
            _stub = scheduler;
        }

        public SchedulerProviderStub()
        {
        }

        public async Task Init()
        {
        }

        public async Task<IScheduler> Scheduler()
        {
            return _stub;
        }
    }
}