namespace $rootnamespace$
{
    using System;
    using CrystalQuartz.Core.Contracts;
	using CrystalQuartz.Core.SchedulerProviders;
    using Quartz;
	using Quartz.Impl;

    public class SimpleSchedulerProvider : ISchedulerProvider
    {
	    public object CreateScheduler(ISchedulerEngine engine)
        {
            ISchedulerFactory schedulerFactory = new StdSchedulerFactory();
            var scheduler = schedulerFactory.GetScheduler();

			// Put jobs creation code here

            // Sample job
            var jobDetail = JobBuilder.Create<HelloJob>()
                .StoreDurably()
                .WithIdentity("myJob")
                .Build();
                
            var trigger = TriggerBuilder.Create()
                .WithIdentity("myTrigger")
                .StartNow()
                .WithSimpleSchedule(x => x.WithIntervalInMinutes(1).RepeatForever())
                .Build();
                
            scheduler.ScheduleJob(jobDetail, trigger);

            return scheduler;
        }

        internal class HelloJob : IJob
        {
            public void Execute(IJobExecutionContext context)
            {
                Console.WriteLine("Hello, CrystalQuartz!");
            }
        }
    }
}