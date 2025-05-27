//using System;

//namespace Demo.Quartz3.DotNetCore3
//{
//    using System.Collections.Generic;
//    using System.Collections.Specialized;
//    using System.Threading.Tasks;
//    using CrystalQuartz.Application;
//    using CrystalQuartz.AspNetCore;
//    using Microsoft.AspNetCore;
//    using Microsoft.AspNetCore.Hosting;
//    using Quartz;
//    using Quartz.Impl;

//    class Program
//    {
//        static async Task Main(string[] args)
//        {
//            var scheduler = CreateScheduler();

//            var builder = WebApplication.CreateBuilder(args)
//                .Configure(app =>
//                {
//                    app.UseCrystalQuartz(() => scheduler, new CrystalQuartzOptions { TimelineSpan = TimeSpan.FromMinutes(1), IsReadOnly = false }); ;
//                });

//            await builder.Build().RunAsync();
//        }

//        private static IScheduler CreateScheduler()
//        {
//            NameValueCollection properties = new NameValueCollection();
//            properties.Add("test1", "test1value");
//            properties.Add("quartz.scheduler.instanceId", "test|pipe");

//            var schedulerFactory = new StdSchedulerFactory();

//            var scheduler = schedulerFactory.GetScheduler().Result;

//            // construct job info
//            var jobDetail = JobBuilder.Create<HelloJob>()
//                .WithIdentity("myJob")
//                .StoreDurably()
//                .Build();

//            // fire every minute
//            var trigger = TriggerBuilder.Create()
//                .WithIdentity("myTrigger")
//                .StartNow()
//                .WithSimpleSchedule(x => x.WithIntervalInMinutes(1).RepeatForever())
//                .Build();

//            scheduler.ScheduleJob(jobDetail, trigger);

//            // construct job info
//            var jobDetail2 = JobBuilder.Create<HelloJob>()
//                .WithIdentity("myJob2")
//                .Build();

//            // fire every 3 minutes
//            var trigger2 = TriggerBuilder.Create()
//                .WithIdentity("myTrigger2")
//                .StartNow()
//                .WithSimpleSchedule(x => x.WithIntervalInMinutes(3))
//                .Build();

//            scheduler.ScheduleJob(jobDetail2, trigger2);

//            var trigger3 = TriggerBuilder.Create()
//                .WithIdentity("myTrigger3")
//                .ForJob(jobDetail2)
//                .StartNow()
//                .WithSimpleSchedule(x => x.WithIntervalInSeconds(100).RepeatForever())
//                //.WithSimpleSchedule(x => x.WithIntervalInMinutes(5).RepeatForever())
//                .Build();

//            scheduler.ScheduleJob(trigger3);

//            // construct job info
//            var jobDetail4 = JobBuilder.Create<HelloJob>()
//                .WithIdentity("myJob4", "MyOwnGroup")
//                .Build();

//            jobDetail4.JobDataMap.Add("key1", "value1");
//            jobDetail4.JobDataMap.Add("key2", "value2");
//            jobDetail4.JobDataMap.Add("key3", 1L);
//            jobDetail4.JobDataMap.Add("key4", 1d);
//            jobDetail4.JobDataMap.Add("key5", new[]
//            {
//                "Test1",
//                "Test2",
//                "Test3"
//            });
//            jobDetail4.JobDataMap.Add("key6", new { FirstName = "John", LastName = "Smith", BirthDate = new DateTime(2011, 03, 08) });

//            // fire every hour
//            ITrigger trigger4 = TriggerBuilder.Create()
//                .WithIdentity("myTrigger4", jobDetail4.Key.Group)
//                .StartNow()
//                .WithSimpleSchedule(x => x.WithIntervalInMinutes(1))
//                .Build();

//            ITrigger trigger5 = TriggerBuilder.Create()
//                .WithIdentity("myTrigger5", jobDetail4.Key.Group)
//                .StartNow()
//                .WithCronSchedule("0 0/5 * * * ?")
//                .Build();


//            scheduler.ScheduleJob(jobDetail4, new List<ITrigger>() { trigger4, trigger5 }.AsReadOnly(), false);
//            //            scheduler.ScheduleJob(jobDetail4, trigger5);

//            scheduler.PauseJob(new JobKey("myJob4", "MyOwnGroup"));
//            scheduler.PauseTrigger(new TriggerKey("myTrigger3", "DEFAULT"));

//            scheduler.Start();

//            return scheduler;
//        }

//        public class HelloJob : IJob
//        {
//            private static readonly Random Random = new Random();

//            public Task Execute(IJobExecutionContext context)
//            {
//                Console.WriteLine("Hello, CrystalQuartz!");
//                var jobDetailJobDataMap = context.MergedJobDataMap;

//                foreach (var key in jobDetailJobDataMap.Keys)
//                {
//                    var jobDataMapItemValue = jobDetailJobDataMap[key];

//                    Console.WriteLine(key + ": " + jobDataMapItemValue + " (" + jobDataMapItemValue.GetType() + ")");
//                }

//                return Task.Delay(TimeSpan.FromSeconds(Random.Next(10, 20)));
//            }
//        }
  // }
//}
