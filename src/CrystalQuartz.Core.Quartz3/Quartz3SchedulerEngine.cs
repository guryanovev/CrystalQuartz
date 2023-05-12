[assembly: System.Runtime.CompilerServices.InternalsVisibleTo("CrystalQuartz.Core.Quartz3.Tests")]

namespace CrystalQuartz.Core.Quartz3
{
    using System;
    using System.Collections.Specialized;
    using System.Threading.Tasks;
    using CrystalQuartz.Core.Contracts;
    using Quartz;
    using Quartz.Impl;

    public class Quartz3SchedulerEngine : ISchedulerEngine
    {
        public async Task<SchedulerServices> CreateServices(object schedulerInstance, Options options)
        {
            IScheduler scheduler = schedulerInstance is Task<IScheduler> task
                ? await task
                : schedulerInstance as IScheduler;

            if (scheduler == null)
            {
                throw new Exception("An instance of Quartz 3 Scheduler expected");
            }

            return new SchedulerServices(
                new Quartz3SchedulerClerk(scheduler),
                new Quartz3SchedulerCommander(scheduler),
                await CreateEventSource(scheduler, options));
        }

        public async Task<object> CreateStandardRemoteScheduler(string url)
        {
            var properties = new NameValueCollection
            {
                ["quartz.scheduler.proxy"] = "true",
                ["quartz.scheduler.proxy.address"] = url,
            };

            ISchedulerFactory schedulerFactory = new StdSchedulerFactory(properties);
            return await schedulerFactory.GetScheduler();
        }

        private async Task<ISchedulerEventSource> CreateEventSource(IScheduler scheduler, Options options)
        {
            SchedulerMetaData schedulerMetaData = await scheduler.GetMetaData();

            if (!schedulerMetaData.SchedulerRemote)
            {
                var result = new Quartz3SchedulerEventSource(options.ExtractErrorsFromUnhandledExceptions);
                scheduler.ListenerManager.AddTriggerListener(result);

                if (options.ExtractErrorsFromUnhandledExceptions)
                {
                    scheduler.ListenerManager.AddJobListener(result);
                }

                return result;
            }

            return null;
        }
    }
}