using CrystalQuartz.Core;
using CrystalQuartz.Core.SchedulerProviders;

namespace CrystalQuartz.Owin
{
    using System;
    using CrystalQuartz.Application;
    using CrystalQuartz.Application.Startup;
    using global::Owin;

    public static class AppBuilderExtensions
    {
        public static void UseCrystalQuartz(
            this IAppBuilder app, 
            Func<object> schedulerProvider)
        {
            UseCrystalQuartz(app, schedulerProvider, null);
        }

        public static void UseCrystalQuartz(
            this IAppBuilder app, 
            Func<object> schedulerProvider, 
            CrystalQuartzOptions options)
        {
            ISchedulerProvider provider = new FuncSchedulerProvider(schedulerProvider);
            UseCrystalQuartz(app, provider, options);
        }

        public static void UseCrystalQuartz(
            this IAppBuilder app, 
            ISchedulerProvider schedulerProvider)
        {
            UseCrystalQuartz(app, schedulerProvider, null);
        }

        public static void UseCrystalQuartz(
            this IAppBuilder app, 
            ISchedulerProvider schedulerProvider, 
            CrystalQuartzOptions options)
        {
            CrystalQuartzOptions actualOptions = options ?? new CrystalQuartzOptions();
            string url = actualOptions.Path ?? "/quartz";

            app.Map(url, privateApp =>
            {
                privateApp.Use<CrystalQuartzPanelMiddleware>(
                    schedulerProvider, 
                    actualOptions.ToRuntimeOptions(SchedulerEngineProviders.SchedulerEngineResolvers, FrameworkVersion.Value));
            });
        }
    }
}