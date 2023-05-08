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
                Console.WriteLine("Before init");

                ISchedulerProvider schedulerProvider = Configuration.ConfigUtils.SchedulerProvider;

                Console.WriteLine("Got scheduler provider");

                Application application = new CrystalQuartzPanelApplication(
                    schedulerProvider,
                    options.ToRuntimeOptions(SchedulerEngineProviders.SchedulerEngineResolvers, FrameworkVersion.Value));

                Console.WriteLine("Got application");

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

            Console.WriteLine("Process request");

            await _runningApplication.Handle(
                new SystemWebRequest(context),
                new SystemWebResponseRenderer(context));

            Console.WriteLine("Request processed");
        }

        // public void ProcessRequest(HttpContext context)
        // {
        //     Console.WriteLine("Process request");
        //
        //     Task handleTask = RunningApplication.Value.Handle(
        //         new SystemWebRequest(context), 
        //         new SystemWebResponseRenderer(context));
        //
        //     var awaitable = handleTask.ConfigureAwait(false);
        //
        //     awaitable.GetAwaiter().GetResult();
        //
        //     Console.WriteLine("Request processed");
        // }

        public virtual bool IsReusable => false;
    }
}