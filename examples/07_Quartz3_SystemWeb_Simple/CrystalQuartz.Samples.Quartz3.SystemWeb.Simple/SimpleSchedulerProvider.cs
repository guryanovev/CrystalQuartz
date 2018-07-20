namespace CrystalQuartz.Samples.Quartz3.SystemWeb.Simple
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
            var scheduler = schedulerFactory.GetScheduler().Result;

			// Put jobs creation code here

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
    }

    public class HelloJob : IJob
    {
        public Task Execute(IJobExecutionContext context)
        {
            return Task.Delay(TimeSpan.FromSeconds(10));
        }
    }
}