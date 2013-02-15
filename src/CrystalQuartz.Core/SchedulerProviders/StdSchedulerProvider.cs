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

        public void Init()
        {
            if (!IsLazy)
            {
                LazyInit();    
            }
        }

        private void LazyInit()
        {
            NameValueCollection properties = null;
            try
            {
                properties = GetSchedulerProperties();
                ISchedulerFactory schedulerFactory = new StdSchedulerFactory(properties);
                _scheduler = schedulerFactory.GetScheduler();
                InitScheduler(_scheduler);
            } 
            catch(Exception ex)
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

        public virtual IScheduler Scheduler
        {
            get
            {
                if (_scheduler == null)
                {
                    LazyInit();
                }

                return _scheduler;
            }
        }
    }
}