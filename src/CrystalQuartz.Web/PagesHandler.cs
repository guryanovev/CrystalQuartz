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

    public class PagesHandler
#if NET40
        : CustomHttpAsyncHandlerBase
#else
        : HttpTaskAsyncHandler
#endif

    {
        private static readonly IRunningApplication _runningApplication;

        static PagesHandler()
        {
            var options = new CrystalQuartzOptions
            {
                CustomCssUrl = Configuration.ConfigUtils.CustomCssUrl
            };

            ISchedulerProvider schedulerProvider = Configuration.ConfigUtils.SchedulerProvider;

            _runningApplication = new CrystalQuartzPanelApplication(
                    schedulerProvider,
                    options.ToRuntimeOptions(SchedulerEngineProviders.SchedulerEngineResolvers, FrameworkVersion.Value))
                .Run();
        }

        public override async Task ProcessRequestAsync(HttpContext context)
        {
            await _runningApplication.Handle(
                new SystemWebRequest(context),
                new SystemWebResponseRenderer(context));
        }

        public override bool IsReusable => true;
    }
}