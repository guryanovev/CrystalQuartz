namespace CrystalQuartz.Owin
{
    using CrystalQuartz.Application;
    using CrystalQuartz.Core.SchedulerProviders;
    using global::Owin;

    public static class AppBuilderExtensions
    {
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