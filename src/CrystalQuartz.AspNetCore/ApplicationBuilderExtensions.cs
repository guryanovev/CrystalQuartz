using CrystalQuartz.Application;
using CrystalQuartz.Core;
using CrystalQuartz.Core.SchedulerProviders;
using System;
using Microsoft.AspNetCore.Builder;

namespace CrystalQuartz.AspNetCore
{
    public static class ApplicationBuilderExtensions
    {
        public static void UseCrystalQuartz(
            this IApplicationBuilder app,
            Func<object> schedulerProvider)
        {
            UseCrystalQuartz(app, schedulerProvider, null);
        }

        public static void UseCrystalQuartz(
            this IApplicationBuilder app,
            Func<object> schedulerProvider,
            CrystalQuartzOptions options)
        {
            ISchedulerProvider provider = new FuncSchedulerProvider(schedulerProvider);
            UseCrystalQuartz(app, provider, options);
        }

        public static void UseCrystalQuartz(
            this IApplicationBuilder app,
            ISchedulerProvider schedulerProvider)
        {
            UseCrystalQuartz(app, schedulerProvider, null);
        }

        public static void UseCrystalQuartz(
            this IApplicationBuilder app,
            ISchedulerProvider schedulerProvider,
            CrystalQuartzOptions options)
        {
            CrystalQuartzOptions actualOptions = options ?? new CrystalQuartzOptions();
            string url = actualOptions.Path ?? "/quartz";

            app.Map(url, privateApp =>
            {
                privateApp.UseMiddleware<CrystalQuartzPanelMiddleware>(
                    schedulerProvider, 
                    new Options(
                        actualOptions.TimelineSpan,
                        SchedulerEngineProviders.SchedulerEngineResolvers,
                        actualOptions.LazyInit,
                        actualOptions.CustomCssUrl,
                        "Core 2.0"));
            });
        }
    }
}