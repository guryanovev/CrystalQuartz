using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(CrystalQuartz.Samples.OwinSimple.Startup))]
namespace CrystalQuartz.Samples.OwinSimple
{
    using CrystalQuartz.Owin;
    using Quartz;
    using Quartz.Impl;

    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            IScheduler scheduler = StdSchedulerFactory.GetDefaultScheduler();

            // define the job and tie it to our HelloJob class
            IJobDetail job = JobBuilder.Create<HelloJob>()
                .WithIdentity("job1", "group1")
                .Build();

            // Trigger the job to run now, and then repeat every 10 seconds
            ITrigger trigger = TriggerBuilder.Create()
                .WithIdentity("trigger1", "group1")
                .StartNow()
                .WithSimpleSchedule(x => x
                    .WithIntervalInSeconds(10)
                    .RepeatForever())
                .Build();

            // Tell quartz to schedule the job using our trigger
            scheduler.ScheduleJob(job, trigger);

            scheduler.Start();

            app.UseCrystalQuartz(scheduler);
        }
    }

    public class HelloJob : IJob
    {
        public void Execute(IJobExecutionContext context)
        {
        }
    }
}
