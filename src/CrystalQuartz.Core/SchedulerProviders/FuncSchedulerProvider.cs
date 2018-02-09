using System;
using CrystalQuartz.Core.Contracts;

namespace CrystalQuartz.Core.SchedulerProviders
{
    public class FuncSchedulerProvider : ISchedulerProvider
    {
        private readonly Func<object> _factory;

        public FuncSchedulerProvider(Func<object> factory)
        {
            _factory = factory;
        }

        public object CreateScheduler(ISchedulerEngine engine)
        {
            return _factory.Invoke();
        }
    }
}