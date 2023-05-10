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
        private static Lazy<Task<RunningApplication>> _runningApplicationLazy;
        private static RunningApplication _runningApplication;

        static PagesHandler()
        {
            var options = new CrystalQuartzOptions
            {
                CustomCssUrl = Configuration.ConfigUtils.CustomCssUrl
            };

            _runningApplicationLazy = new Lazy<Task<RunningApplication>>(() =>
            {
                ISchedulerProvider schedulerProvider = Configuration.ConfigUtils.SchedulerProvider;

                Application application = new CrystalQuartzPanelApplication(
                    schedulerProvider,
                    options.ToRuntimeOptions(SchedulerEngineProviders.SchedulerEngineResolvers, FrameworkVersion.Value));

                return application.Run();
            });

            if (!options.LazyInit)
            {
                var runningApplicationValue = _runningApplicationLazy.Value;
            }
        }

        public override async Task ProcessRequestAsync(HttpContext context)
        {
            if (_runningApplication == null)
            {
                _runningApplication = await _runningApplicationLazy.Value;
            }

            await _runningApplication.Handle(
                new SystemWebRequest(context),
                new SystemWebResponseRenderer(context));
        }

        public virtual bool IsReusable => true;
    }
}