using CrystalQuartz.Core.Contracts;
using CrystalQuartz.Core.SchedulerProviders;
using Quartz.Impl;

namespace CrystalQuartz.Web.Demo
{
    using System.Collections.Specialized;
    using Quartz;
    using Quartz.Collection;

    public class FakeProvider : ISchedulerProvider
    {
        public object CreateScheduler(ISchedulerEngine engine)
        {
            NameValueCollection properties = new NameValueCollection();
            properties.Add("test1", "test1value");
            properties.Add("quartz.scheduler.instanceName", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque iaculis et nibh id ornare. Proin vitae sem nulla. Nulla facilisi. Aenean consequat tellus nulla, ac accumsan mi dictum at. Cras scelerisque imperdiet finibus. Praesent aliquet magna justo, eu lacinia felis vehicula eget. In magna felis, congue ac mi et, rhoncus scelerisque odio.");

            ISchedulerFactory schedulerFactory = new StdSchedulerFactory(properties);
            var scheduler = schedulerFactory.GetScheduler();

            // construct job info
            var jobDetail = JobBuilder.Create<HelloJob>()
                .WithIdentity("myJob")
                .StoreDurably()
                .Build();

            // fire every minute
            var trigger = TriggerBuilder.Create()
                .WithIdentity("myTrigger")
                .StartNow()
                .WithSimpleSchedule(x => x.WithIntervalInMinutes(1).RepeatForever())
                .Build();

            scheduler.ScheduleJob(jobDetail, trigger);

            // construct job info
            var jobDetail2 = JobBuilder.Create<HelloJob>()
                .WithIdentity("myJob2")
                .Build();

            // fire every 3 minutes
            var trigger2 = TriggerBuilder.Create()
                .WithIdentity("myTrigger2")
                .StartNow()
                .WithSimpleSchedule(x => x.WithIntervalInMinutes(3))
                .Build();

            scheduler.ScheduleJob(jobDetail2, trigger2);

            var trigger3 = TriggerBuilder.Create()
                .WithIdentity("myTrigger3")
                .ForJob(jobDetail2)
                .StartNow()
                .WithSimpleSchedule(x => x.WithIntervalInSeconds(40).RepeatForever())
                //.WithSimpleSchedule(x => x.WithIntervalInMinutes(5).RepeatForever())
                .Build();

            scheduler.ScheduleJob(trigger3);

            // construct job info
            var jobDetail4 = JobBuilder.Create<HelloJob>()
                .WithIdentity("myJob4", "MyOwnGroup")
                .Build();

            jobDetail4.JobDataMap.Add("key1", "value1");
            jobDetail4.JobDataMap.Add("key2", "value2");
            jobDetail4.JobDataMap.Add("key3", 1L);
            jobDetail4.JobDataMap.Add("key4", 1d);

            // fire every hour
            ITrigger trigger4 = TriggerBuilder.Create()
                .WithIdentity("myTrigger4", jobDetail4.Key.Group)
                .StartNow()
                .WithSimpleSchedule(x => x.WithIntervalInMinutes(1))
                .Build();

            ITrigger trigger5 = TriggerBuilder.Create()
                .WithIdentity("myTrigger5", jobDetail4.Key.Group)
                .StartNow()
                .WithCronSchedule("0 0/5 * * * ?")
                .Build();


            scheduler.ScheduleJob(jobDetail4, new HashSet<ITrigger>(new[] { trigger4, trigger5 }), false);
            //            scheduler.ScheduleJob(jobDetail4, trigger5);

            scheduler.PauseJob(new JobKey("myJob4", "MyOwnGroup"));
            scheduler.PauseTrigger(new TriggerKey("myTrigger3", "DEFAULT"));

            return scheduler;
        }
    }
}