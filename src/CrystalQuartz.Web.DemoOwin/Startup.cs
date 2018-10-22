using System;
using CrystalQuartz.Application;
using Microsoft.Owin;
using Owin;
using Quartz;
using Quartz.Collection;
using Quartz.Impl;

[assembly: OwinStartup(typeof(CrystalQuartz.Web.DemoOwin.Startup))]
namespace CrystalQuartz.Web.DemoOwin
{
    using System.Web.Http;
    using System.Web.Mvc;
    using System.Web.Optimization;
    using System.Web.Routing;
    using CrystalQuartz.Owin;

    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            var scheduler = CreateScheduler();

            app.UseCrystalQuartz(() => scheduler, new CrystalQuartzOptions
            {
                TimelineSpan = TimeSpan.FromMinutes(10)
            });

            RouteTable.Routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
        }

        private IScheduler CreateScheduler()
        {
            var schedulerFactory = new StdSchedulerFactory();

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
                .WithSimpleSchedule(x => x.WithIntervalInMinutes(1).RepeatForever().WithMisfireHandlingInstructionNextWithRemainingCount())
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
                .WithSimpleSchedule(x => x.WithIntervalInMinutes(3).WithMisfireHandlingInstructionIgnoreMisfires())
                .Build();

            scheduler.ScheduleJob(jobDetail2, trigger2);

            var trigger3 = TriggerBuilder.Create()
                .WithIdentity("myTrigger3")
                .ForJob(jobDetail2)
                .StartNow()
                .WithSimpleSchedule(x => x.WithIntervalInSeconds(2).RepeatForever())
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
            jobDetail4.JobDataMap.Add("key5", new[]
            {
                "Test1",
                "Test2",
                "Test3"
            });
            jobDetail4.JobDataMap.Add("key6", new { FirstName = "John", LastName = "Smith", BirthDate = new DateTime(2011, 03, 08) });

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
            scheduler.Start();

            return scheduler;
        }
    }
}
