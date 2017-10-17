using System.Collections.ObjectModel;
using System.Threading.Tasks;

namespace CrystalQuartz.Web.Demo
{
    using System.Collections.Specialized;
    using CrystalQuartz.Core.SchedulerProviders;
    using Quartz;

    public class FakeProvider : StdSchedulerProvider
    {
        protected override NameValueCollection GetSchedulerProperties()
        {
            var properties = base.GetSchedulerProperties();
            properties.Add("test1", "test1value");
            return properties;
        }

        protected override async Task InitScheduler(IScheduler scheduler)
        {
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

            await scheduler.ScheduleJob(jobDetail, trigger).ConfigureAwait(false);

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

            await scheduler.ScheduleJob(jobDetail2, trigger2).ConfigureAwait(false);

            var trigger3 = TriggerBuilder.Create()
                .WithIdentity("myTrigger3")
                .ForJob(jobDetail2)
                .StartNow()
                .WithSimpleSchedule(x => x.WithIntervalInSeconds(2).RepeatForever())
                //.WithSimpleSchedule(x => x.WithIntervalInMinutes(5).RepeatForever())
                .Build();
                
            await scheduler.ScheduleJob(trigger3).ConfigureAwait(false);

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


            await scheduler.ScheduleJob(jobDetail4, new ReadOnlyCollection<ITrigger>(new[] { trigger4, trigger5}), false).ConfigureAwait(false);
//            scheduler.ScheduleJob(jobDetail4, trigger5);

            await scheduler.PauseJob(new JobKey("myJob4", "MyOwnGroup")).ConfigureAwait(false);
            await scheduler.PauseTrigger(new TriggerKey("myTrigger3", "DEFAULT")).ConfigureAwait(false); 
        }
    }
}