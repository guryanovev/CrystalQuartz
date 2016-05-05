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

        public void Init()
        {
        }

        public IScheduler Scheduler
        {
            get
            {
                return _factory.Invoke();
            }
        }
    }
}