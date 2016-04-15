namespace CrystalQuartz.Owin
{
    using CrystalQuartz.Core.SchedulerProviders;
    using global::Owin;

    public static class AppBuilderExtensions
    {
        public static void UseCrystalQuartz(this IAppBuilder app, ISchedulerProvider scheduleProvider)
        {
            app.Map("/CrystalQuartzPanel.axd", privateApp =>
            {
                privateApp.Use(typeof (CrystalQuartzPanelMiddleware), scheduleProvider);
            });
        }
    }
}