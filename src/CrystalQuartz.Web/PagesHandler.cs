namespace CrystalQuartz.Web
{
    using System.Web;
    using CrystalQuartz.Application;
    using CrystalQuartz.Application.Startup;
    using CrystalQuartz.Core.SchedulerProviders;
    using CrystalQuartz.WebFramework;
    using WebFramework.Utils;

    public class PagesHandler : IHttpHandler
    {
        private static readonly RunningApplication RunningApplication;

        static PagesHandler()
        {
            var options = new CrystalQuartzOptions
            {
                CustomCssUrl = Configuration.ConfigUtils.CustomCssUrl
            }; 

            ISchedulerProvider schedulerProvider = Configuration.ConfigUtils.SchedulerProvider;

            Application application = new CrystalQuartzPanelApplication(
                schedulerProvider, 
                options.ToRuntimeOptions(SchedulerEngineProviders.SchedulerEngineResolvers, FrameworkVersion.Value));

            RunningApplication = application.Run();
        }

        public void ProcessRequest(HttpContext context)
        {
            RunningApplication.Handle(
                new SystemWebRequest(context), 
                new SystemWebResponseRenderer(context)).Wait();
        }

        public virtual bool IsReusable
        {
            get { return false; }
        }
    }
}