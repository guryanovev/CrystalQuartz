namespace CrystalQuartz.Owin
{
    using System;
    using CrystalQuartz.Application;
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
            CrystalQuartzOptions actualOptions = options ?? new CrystalQuartzOptions();
            string url = actualOptions.Path ?? "/quartz";

            app.Map(url, privateApp =>
            {
                privateApp.Use<CrystalQuartzPanelMiddleware>(schedulerProvider, actualOptions);
            });
        }
    }
}