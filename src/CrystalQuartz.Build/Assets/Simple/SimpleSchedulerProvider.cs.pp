namespace $rootnamespace$
{
    using System;
    using CrystalQuartz.Core.SchedulerProviders;
    using Quartz;

    public class SimpleSchedulerProvider : StdSchedulerProvider
    {
        protected override System.Collections.Specialized.NameValueCollection GetSchedulerProperties()
        {
            var properties = base.GetSchedulerProperties();
            // Place custom properties creation here:
            //     properties.Add("test1", "test1value");
            return properties;
        }

        protected override void InitScheduler(IScheduler scheduler)
        {
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