namespace CrystalQuartz.Web
{
    using System.Web;
    using CrystalQuartz.Application;
    using CrystalQuartz.Core;
    using CrystalQuartz.Core.SchedulerProviders;
    using CrystalQuartz.WebFramework;
    using CrystalQuartz.WebFramework.SystemWeb;

    public class CrystalQuartzPanelOptions
    {
        private readonly string _customCssUrl;
        private readonly ISchedulerProvider _schedulerProvider;
        private readonly ISchedulerDataProvider _schedulerDataProvider;

        public CrystalQuartzPanelOptions(string customCssUrl, ISchedulerProvider schedulerProvider, ISchedulerDataProvider schedulerDataProvider)
        {
            _customCssUrl = customCssUrl;
            _schedulerProvider = schedulerProvider;
            _schedulerDataProvider = schedulerDataProvider;
        }

        public string CustomCssUrl
        {
            get { return _customCssUrl; }
        }

        public ISchedulerProvider SchedulerProvider
        {
            get { return _schedulerProvider; }
        }

        public ISchedulerDataProvider SchedulerDataProvider
        {
            get { return _schedulerDataProvider; }
        }
    }

    public class DefaultOptions
    {
        public static readonly ISchedulerDataProvider SchedulerDataProvider;
        public static readonly ISchedulerProvider SchedulerProvider;
        public static readonly string CustomCssUrl;

        static DefaultOptions()
        {
            CustomCssUrl = Configuration.ConfigUtils.CustomCssUrl;
            SchedulerProvider = Configuration.ConfigUtils.SchedulerProvider;
            SchedulerProvider.Init();
            SchedulerDataProvider = new DefaultSchedulerDataProvider(SchedulerProvider);
        }
    }

    public class PagesHandler : IHttpHandler
    {
        private readonly RunningApplication _runningApplication;

        public PagesHandler() : this(new CrystalQuartzPanelOptions(
            DefaultOptions.CustomCssUrl,
            DefaultOptions.SchedulerProvider,
            DefaultOptions.SchedulerDataProvider))
        {
        }

        public PagesHandler(CrystalQuartzPanelOptions options)
        {
            Application application = new CrystalQuartzPanelApplication(
                options.SchedulerProvider,
                options.SchedulerDataProvider,
                options.CustomCssUrl);

            _runningApplication = application.Run();
        }

//        private static IList<IRequestHandler> GetProcessors(CrystalQuartzPanelOptions options)
//        {
//            var handlers = new CrystalQuartzPanelApplication(
//                options.SchedulerProvider, 
//                options.SchedulerDataProvider,
//                options.CustomCssUrl).Config.Handlers;
//
//            var result = new List<IRequestHandler>();
//            result.Add(new FileRequestHandler(typeof(PagesHandler).Assembly, "CrystalQuartz.Web.Content."));
//            result.AddRange(handlers);
//            
//            return result;
//        }

        public void ProcessRequest(HttpContext context)
        {
            _runningApplication.Handle(
                new SystemWebRequest(context), 
                new SystemWebResponseRenderer(context));
        }

        public virtual bool IsReusable
        {
            get { return false; }
        }
    }
}