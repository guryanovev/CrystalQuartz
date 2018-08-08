namespace CrystalQuartz.Core.Quartz2
{
    using System;
    using System.Collections.Specialized;
    using CrystalQuartz.Core.Contracts;
    using Quartz;
    using Quartz.Impl;

    public class Quartz2SchedulerEngine : ISchedulerEngine
    {
        public SchedulerServices CreateServices(object schedulerInstance, Options options)
        {
            IScheduler scheduler = schedulerInstance as IScheduler;

            if (scheduler == null)
            {
                throw new Exception("An instance of Quartz 2 Scheduler expected");
            }

            return new SchedulerServices(
                new Quartz2SchedulerClerk(scheduler),
                new Quartz2SchedulerCommander(scheduler), 
                CreateEventSource(scheduler));
        }

        private ISchedulerEventSource CreateEventSource(IScheduler scheduler)
        {
            if (!scheduler.GetMetaData().SchedulerRemote)
            {
                var result = new Quartz2SchedulerEventSource();
                scheduler.ListenerManager.AddTriggerListener(result);

                return result;
            }

            return null;
        }

        public object CreateStandardRemoteScheduler(string url)
        {
            var properties = new NameValueCollection();
            properties["quartz.scheduler.proxy"] = "true";
            properties["quartz.scheduler.proxy.address"] = url;

            ISchedulerFactory schedulerFactory = new StdSchedulerFactory(properties);
            return schedulerFactory.GetScheduler();
        }
    }
}