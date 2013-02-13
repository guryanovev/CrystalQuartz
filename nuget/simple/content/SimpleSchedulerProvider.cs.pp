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
            JobDetail jobDetail = new JobDetail("myJob", null, typeof(HelloJob));
            jobDetail.Durable = true;
            Trigger trigger = TriggerUtils.MakeMinutelyTrigger(1, 2);
            trigger.StartTimeUtc = DateTime.UtcNow;
            trigger.Name = "myTrigger";
            scheduler.ScheduleJob(jobDetail, trigger);
        }

        internal class HelloJob : IJob
        {
            public void Execute(JobExecutionContext context)
            {
                Console.WriteLine("Hello, CrystalQuartz!");
            }
        }
    }
}