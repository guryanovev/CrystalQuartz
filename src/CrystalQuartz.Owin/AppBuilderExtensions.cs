namespace CrystalQuartz.Owin
{
    using System;
    using CrystalQuartz.Application;
    using CrystalQuartz.Core.SchedulerProviders;
    using global::Owin;
    using Quartz;

    public static class AppBuilderExtensions
    {
        public static void UseCrystalQuartz(
            this IAppBuilder app,
            IScheduler scheduler)
        {
            UseCrystalQuartz(app, scheduler, null);
        }

        public static void UseCrystalQuartz(
            this IAppBuilder app,
            IScheduler scheduler,
            CrystalQuartzOptions options)
        {
            app.UseCrystalQuartz(() => scheduler, options);
        }

        public static void UseCrystalQuartz(
            this IAppBuilder app, 
            Func<IScheduler> schedulerProvider)
        {
            UseCrystalQuartz(app, schedulerProvider, null);
        }

        public static void UseCrystalQuartz(
            this IAppBuilder app, 
            Func<IScheduler> schedulerProvider, 
            CrystalQuartzOptions options)
        {
            app.UseCrystalQuartz(new FuncSchedulerProvider(schedulerProvider), options);
        }

        public static void UseCrystalQuartz(
            this IAppBuilder app, 
            ISchedulerProvider scheduleProvider)
        {
            UseCrystalQuartz(app, scheduleProvider, null);
        }

        public static void UseCrystalQuartz(
            this IAppBuilder app, 
            ISchedulerProvider scheduleProvider,
            CrystalQuartzOptions options)
        {
            app.Map("/CrystalQuartzPanel.axd", privateApp =>
            {
                privateApp.Use(typeof (CrystalQuartzPanelMiddleware), scheduleProvider, options ?? new CrystalQuartzOptions());
            });
        }
    }
}