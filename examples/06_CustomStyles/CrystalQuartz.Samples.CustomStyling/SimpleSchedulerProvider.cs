namespace CrystalQuartz.Samples.CustomStyling
{
    using System;
    using CrystalQuartz.Core.SchedulerProviders;
    using CrystalQuartz.Core.Contracts;
    using Quartz;
    using Quartz.Impl;

    public class SimpleSchedulerProvider : ISchedulerProvider
    {
        public object CreateScheduler(ISchedulerEngine engine)
        {
            IScheduler scheduler = StdSchedulerFactory.GetDefaultScheduler();

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