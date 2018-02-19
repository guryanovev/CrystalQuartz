namespace $rootnamespace$
{
    using System;
	using System.Threading.Tasks;
    using CrystalQuartz.Core.Contracts;
	using CrystalQuartz.Core.SchedulerProviders;
    using Quartz;
	using Quartz.Impl;

    public class SimpleSchedulerProvider : ISchedulerProvider
    {
	    public object CreateScheduler(ISchedulerEngine engine)
        {
            ISchedulerFactory schedulerFactory = new StdSchedulerFactory();
            var scheduler = GetScheduler(schedulerFactory.GetScheduler());

			// Put jobs creation code here

			/*

            var jobDetail = JobBuilder.Create<HelloJob>()
                .StoreDurably()
                .WithIdentity("myJob")
                .Build();
                
            var trigger = TriggerBuilder.Create()
                .WithIdentity("myTrigger")
                .StartNow()
                .WithSimpleSchedule(x => x.WithIntervalInMinutes(1).RepeatForever())
                .Build();
                
            scheduler.ScheduleJob(jobDetail, trigger); */

            return scheduler;
        }

		/*
		 * Here are just a few overloads to support both v2 and v3 versions on Quartz.
		 * Fill free to avoid these methods.
		 */

		private IScheduler GetScheduler(IScheduler scheduler) {
			return scheduler;
		}

		private IScheduler GetScheduler(Task<IScheduler> scheduler) {
			return scheduler.Result;
		}
    }
}