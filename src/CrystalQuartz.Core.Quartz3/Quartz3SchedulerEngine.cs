using System;
using System.Collections.Specialized;
using System.Reflection;
using CrystalQuartz.Core.Contracts;
using Quartz;
using Quartz.Impl;

namespace CrystalQuartz.Core.Quartz3
{
    public class Quartz3SchedulerEngine : ISchedulerEngine
    {
        public SchedulerHost CreateHost(object schedulerInstance, Options options)
        {
            IScheduler scheduler = schedulerInstance as IScheduler;

            if (scheduler == null)
            {
                throw new Exception("An instance of Quartz 3 Scheduler expected");
            }

            return new SchedulerHost(
                new Quartz3SchedulerClerk(scheduler),
                new Quartz3SchedulerCommander(scheduler), 
                CreateEventSource(scheduler),
                Assembly.GetAssembly(typeof(IScheduler)).GetName().Version);
        }

        private ISchedulerEventSource CreateEventSource(IScheduler scheduler)
        {
            if (!scheduler.GetMetaData().Result.SchedulerRemote)
            {
                var result = new Quartz3SchedulerEventSource();
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