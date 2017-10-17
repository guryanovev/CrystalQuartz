using System.Threading.Tasks;

namespace CrystalQuartz.Core.SchedulerProviders
{
    using System;
    using System.Collections.Specialized;
    using Quartz;
    using Quartz.Impl;

    public class StdSchedulerProvider : ISchedulerProvider
    {
        protected IScheduler _scheduler;

        protected virtual bool IsLazy
        {
            get { return false; }
        }

        public async Task Init()
        {
            if (!IsLazy)
            {
                await LazyInit().ConfigureAwait(false);
            }
        }

        private async Task LazyInit()
        {
            NameValueCollection properties = null;
            try
            {
                properties = GetSchedulerProperties();
                ISchedulerFactory schedulerFactory = new StdSchedulerFactory(properties);
                _scheduler = await schedulerFactory.GetScheduler().ConfigureAwait(false);
                InitScheduler(_scheduler);
            }
            catch (Exception ex)
            {
                throw new SchedulerProviderException("Could not initialize scheduler", ex, properties);
            }

            if (_scheduler == null)
            {
                throw new SchedulerProviderException(
                    "Could not initialize scheduler", properties);
            }
        }

        protected virtual void InitScheduler(IScheduler scheduler)
        {
        }

        protected virtual NameValueCollection GetSchedulerProperties()
        {
            return new NameValueCollection();
        }

        public virtual async Task<IScheduler> Scheduler()
        {
            if (_scheduler == null)
            {
                await LazyInit().ConfigureAwait(false);
            }

            return _scheduler;
        }
    }
}