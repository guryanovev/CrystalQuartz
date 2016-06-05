namespace CrystalQuartz.Samples.OwinConsole
{
    using System;
    using CrystalQuarts.Samples.Common;
    using CrystalQuartz.Owin;
    using global::Owin;
    using Microsoft.Owin.Hosting;
    using Quartz;
    using Quartz.Impl;

    class Program
    {
        static void Main()
        {
            IScheduler scheduler = SetupScheduler();
            Action<IAppBuilder> startup = app => 
            {
                app.UseCrystalQuartz(scheduler);
            };

            Console.WriteLine("Starting self-hosted server...");
            using (WebApp.Start("http://localhost:9000/", startup))
            {
                Console.WriteLine("Server is started");
                Console.WriteLine();
                Console.WriteLine("Check http://localhost:9000/CrystalQuartzPanel.axd to see jobs information");
                Console.WriteLine();

                Console.WriteLine("Starting scheduler...");
                scheduler.Start();

                Console.WriteLine("Scheduler is started");
                Console.WriteLine();
                Console.WriteLine("Press [ENTER] to close");     
                Console.ReadLine();     
            }

            Console.WriteLine("Shutting down...");
            scheduler.Shutdown(waitForJobsToComplete: true);
            Console.WriteLine("Scheduler has been stopped");
        }

        private static IScheduler SetupScheduler()
        {
            IScheduler scheduler = StdSchedulerFactory.GetDefaultScheduler();

            IJobDetail job = JobBuilder.Create<PrintMessageJob>()
                .WithIdentity("job1", "group1")
                .Build();

            ITrigger trigger = TriggerBuilder.Create()
                .WithIdentity("trigger1", "group1")
                .StartNow()
                .WithSimpleSchedule(x => x
                    .WithIntervalInSeconds(10)
                    .RepeatForever())
                .Build();

            scheduler.ScheduleJob(job, trigger);

            return scheduler;
        }
    }
}
