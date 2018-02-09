using System;
using CrystalQuartz.Core.Contracts;
using CrystalQuartz.Core.SchedulerProviders;

namespace CrystalQuartz.Core
{
    public class ShedulerHostInitializer
    {
        private readonly object _lock = new object();

        private readonly ISchedulerEngine _factory;
        private readonly ISchedulerProvider _schedulerProvider;
        private readonly Options _options;

        private bool _valueCreated = false;
        private SchedulerHost _schedulerHost;

        public ShedulerHostInitializer(ISchedulerEngine factory, ISchedulerProvider schedulerProvider, Options options)
        {
            _factory = factory;
            _schedulerProvider = schedulerProvider;
            _options = options;
        }

        public SchedulerHost SchedulerHost
        {
            get
            {
                if (!_valueCreated)
                {
                    lock (_lock)
                    {
                        if (!_valueCreated)
                        {
                            _schedulerHost = _factory.CreateHost(_schedulerProvider.CreateScheduler(_factory), _options);
                            _valueCreated = true;
                        }
                    }
                }

                return _schedulerHost;
            }
        }
    }
}