namespace CrystalQuartz.Web
{
    using System.Collections.Generic;
    using CrystalQuartz.Core;
    using CrystalQuartz.Core.SchedulerProviders;
    using CrystalQuartz.Web.FrontController;
    using CrystalQuartz.WebFramework.Request;

    public class PagesHandler : FrontControllerHandler
    {
        private static readonly ISchedulerDataProvider SchedulerDataProvider;

        private static readonly ISchedulerProvider SchedulerProvider;

        static PagesHandler()
        {
            SchedulerProvider = Configuration.ConfigUtils.SchedulerProvider;
            SchedulerProvider.Init();
            SchedulerDataProvider = new DefaultSchedulerDataProvider(SchedulerProvider);
        }

        public PagesHandler() : base(GetProcessors())
        {
        }

        private static IList<IRequestHandler> GetProcessors()
        {
            var handlers = new CrystalQuartzPanelApplication(SchedulerProvider, SchedulerDataProvider).Config.Handlers;

            var result = new List<IRequestHandler>();
            result.Add(new FileRequestHandler(typeof(PagesHandler).Assembly, "CrystalQuartz.Web.Content."));
            result.AddRange(handlers);
            
            return result;
        }
    }
}