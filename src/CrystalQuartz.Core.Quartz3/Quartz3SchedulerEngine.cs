using System;
using System.Collections.Specialized;
using CrystalQuartz.Core.Contracts;
using Quartz;
using Quartz.Impl;

namespace CrystalQuartz.Core.Quartz3
{
    public class Quartz3SchedulerEngine : ISchedulerEngine
    {
        public SchedulerServices CreateServices(object schedulerInstance, Options options)
        {
            IScheduler scheduler = schedulerInstance as IScheduler;

            if (scheduler == null)
            {
                throw new Exception("An instance of Quartz 3 Scheduler expected");
            }

            return new SchedulerServices(
                new Quartz3SchedulerClerk(scheduler),
                new Quartz3SchedulerCommander(scheduler), 
                CreateEventSource(scheduler));
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
            return schedulerFactory.GetScheduler().Result;
        }
    }
}