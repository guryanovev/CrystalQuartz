using System.Threading.Tasks;

namespace CrystalQuartz.Core.SchedulerProviders
{
    using System;
    using Quartz;

    public class FuncSchedulerProvider : ISchedulerProvider
    {
        private readonly Func<IScheduler> _factory;

        public FuncSchedulerProvider(Func<IScheduler> factory)
        {
            _factory = factory;
        }

        public async Task Init()
        {
        }

        public Task<IScheduler> Scheduler()
        {
            return Task.FromResult(_factory.Invoke());
        }
    }
}