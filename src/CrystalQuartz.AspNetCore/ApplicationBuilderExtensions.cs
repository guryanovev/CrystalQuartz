namespace CrystalQuartz.AspNetCore
{
    using System;
    using CrystalQuartz.Application;
    using CrystalQuartz.Application.Startup;
    using CrystalQuartz.Core.SchedulerProviders;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Http.Features;

    public static class ApplicationBuilderExtensions
    {
        public static void UseCrystalQuartz(
            this IApplicationBuilder app,
            Func<object> schedulerProvider,
            AspNetCoreOptions aspNetCoreOptions = null)
        {
            UseCrystalQuartz(app, schedulerProvider, null, aspNetCoreOptions);
        }

        public static void UseCrystalQuartz(
            this IApplicationBuilder app,
            Func<object> schedulerProvider,
            CrystalQuartzOptions options,
            AspNetCoreOptions aspNetCoreOptions = null)
        {
            ISchedulerProvider provider = new FuncSchedulerProvider(schedulerProvider);
            UseCrystalQuartz(app, provider, options, aspNetCoreOptions);
        }

        public static void UseCrystalQuartz(
            this IApplicationBuilder app,
            ISchedulerProvider schedulerProvider,
            AspNetCoreOptions aspNetCoreOptions = null)
        {
            UseCrystalQuartz(app, schedulerProvider, null, aspNetCoreOptions);
        }

        public static void UseCrystalQuartz(
            this IApplicationBuilder app,
            ISchedulerProvider schedulerProvider,
            CrystalQuartzOptions options,
            AspNetCoreOptions aspNetCoreOptions = null)
        {
            CrystalQuartzOptions actualOptions = options ?? new CrystalQuartzOptions();
            AspNetCoreOptions actualAspNetCoreOptions = aspNetCoreOptions ?? new AspNetCoreOptions();

            string url = actualOptions.Path ?? "/quartz";

            app.Map(url, privateApp =>
            {
                if (actualAspNetCoreOptions.ForceSyncIO)
                {
                    privateApp.Use((context, func) =>
                    {
                        IHttpBodyControlFeature feature = context.Features.Get<IHttpBodyControlFeature>();
                        if (feature != null)
                        {
                            feature.AllowSynchronousIO = true;
                        }

                        return func.Invoke();
                    });
                }

                privateApp.UseMiddleware<CrystalQuartzPanelMiddleware>(
                    schedulerProvider,
                    actualOptions.ToRuntimeOptions(SchedulerEngineProviders.SchedulerEngineResolvers, FrameworkVersion.Value));
            });
        }
    }
}