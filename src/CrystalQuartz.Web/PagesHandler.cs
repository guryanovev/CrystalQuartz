namespace CrystalQuartz.Web
{
    using System.Collections.Generic;
    using CrystalQuartz.Core;
    using CrystalQuartz.Core.SchedulerProviders;
    using CrystalQuartz.Web.FrontController;
    using CrystalQuartz.WebFramework.Request;

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

    public class PagesHandler : FrontControllerHandler
    {
//        private static readonly ISchedulerDataProvider SchedulerDataProvider;
//        private static readonly ISchedulerProvider SchedulerProvider;
//        private static readonly string CustomCssUrl;

        public PagesHandler() : this(new CrystalQuartzPanelOptions(
            DefaultOptions.CustomCssUrl,
            DefaultOptions.SchedulerProvider,
            DefaultOptions.SchedulerDataProvider))
        {
        }

        public PagesHandler(CrystalQuartzPanelOptions options) : base(GetProcessors(options))
        {
        }

        private static IList<IRequestHandler> GetProcessors(CrystalQuartzPanelOptions options)
        {
            var handlers = new CrystalQuartzPanelApplication(
                options.SchedulerProvider, 
                options.SchedulerDataProvider,
                options.CustomCssUrl).Config.Handlers;

            var result = new List<IRequestHandler>();
            result.Add(new FileRequestHandler(typeof(PagesHandler).Assembly, "CrystalQuartz.Web.Content."));
            result.AddRange(handlers);
            
            return result;
        }
    }
}