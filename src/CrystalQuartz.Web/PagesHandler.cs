namespace CrystalQuartz.Web
{
    using System;
    using System.Threading.Tasks;
    using System.Web;
    using CrystalQuartz.Application;
    using CrystalQuartz.Application.Startup;
    using CrystalQuartz.Core.SchedulerProviders;
    using CrystalQuartz.WebFramework;
    using WebFramework.Utils;

    public class PagesHandler : IHttpHandler
    {
        private static readonly Lazy<RunningApplication> RunningApplication;
        
        static PagesHandler()
        {
            var options = new CrystalQuartzOptions
            {
                CustomCssUrl = Configuration.ConfigUtils.CustomCssUrl
            };

            RunningApplication = new Lazy<RunningApplication>(() =>
            {
                ISchedulerProvider schedulerProvider = Configuration.ConfigUtils.SchedulerProvider;

                Application application = new CrystalQuartzPanelApplication(
                    schedulerProvider,
                    options.ToRuntimeOptions(SchedulerEngineProviders.SchedulerEngineResolvers, FrameworkVersion.Value));

                return application.Run().ConfigureAwait(false).GetAwaiter().GetResult();
            });

            if (!options.LazyInit)
            {
                RunningApplication runningApplicationValue = RunningApplication.Value;
            }
        }

        public void ProcessRequest(HttpContext context)
        {
            Task handleTask = RunningApplication.Value.Handle(
                new SystemWebRequest(context), 
                new SystemWebResponseRenderer(context));

            var awaitable = handleTask.ConfigureAwait(false);

            awaitable.GetAwaiter().GetResult();
        }

        public virtual bool IsReusable => false;
    }
}