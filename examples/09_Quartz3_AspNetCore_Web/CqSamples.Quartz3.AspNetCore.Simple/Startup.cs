using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CrystalQuartz.AspNetCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Quartz;
using Quartz.Impl;

namespace CqSamples.Quartz3.AspNetCore.Simple
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseBrowserLink();
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseStaticFiles();

            var scheduler = CreateScheduler();
            app.UseCrystalQuartz(() => scheduler);

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });
        }

        private static IScheduler CreateScheduler()
        {
            var schedulerFactory = new StdSchedulerFactory();
            var scheduler = schedulerFactory.GetScheduler().Result;

            var job = JobBuilder.Create<PrintMessageJob>()
                .WithIdentity("localJob", "default")
                .Build();

            var trigger = TriggerBuilder.Create()
                .WithIdentity("trigger1", "default")
                .ForJob(job)
                .StartNow()
                .WithCronSchedule("0 /1 * ? * *")
                .Build();

            scheduler.ScheduleJob(job, trigger);

            scheduler.Start();

            return scheduler;
        }
    }

    public class PrintMessageJob : IJob
    {
        private static readonly Random Random = new Random();

        public Task Execute(IJobExecutionContext context)
        {
            var color = Console.ForegroundColor;
            Console.ForegroundColor = ConsoleColor.DarkYellow;
            Console.WriteLine("Greetings from HelloJob!");
            Console.ForegroundColor = color;

            return Task.Delay(TimeSpan.FromSeconds(Random.Next(1, 20)));
        }
    }
}
