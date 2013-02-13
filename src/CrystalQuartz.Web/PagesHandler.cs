namespace CrystalQuartz.Web
{
    using System.Collections.Generic;
    using Core;
    using Core.SchedulerProviders;
    using FrontController;
    using FrontController.RequestMatching;
    using FrontController.ViewRendering;
    using Processors;
    using Processors.Operations;

    public class PagesHandler : FrontControllerHandler
    {
        private static readonly IViewEngine ViewEngine;

        private static readonly ISchedulerDataProvider SchedulerDataProvider;

        private static readonly ISchedulerProvider SchedulerProvider;

        static PagesHandler()
        {
            ViewEngine = new VelocityViewEngine();
            ViewEngine.Init();
            SchedulerProvider = Configuration.ConfigUtils.SchedulerProvider;
            SchedulerProvider.Init();
            SchedulerDataProvider = new DefaultSchedulerDataProvider(SchedulerProvider);
        }

        public PagesHandler()
            : base(GetProcessors())
        {
        }

        private static IList<IRequestHandler> GetProcessors()
        {
            return new List<IRequestHandler>
               {
                   new FileRequestProcessor(),
                   new DefaultRequestHandler(
                       new SingleParamRequestMatcher("command", "scheduler-start"),
                       new StartSchedulerFiller(SchedulerProvider)),
                   new DefaultRequestHandler(
                       new SingleParamRequestMatcher("page", "job"),
                       new JobFiller(ViewEngine, SchedulerDataProvider)),
                   new DefaultRequestHandler(
                       new SingleParamRequestMatcher("command", "scheduler-stop"),
                       new StopSchedulerFiller(SchedulerProvider)),
                   new DefaultRequestHandler(
                       new SingleParamRequestMatcher("command", "job-trigger"),
                       new TriggerJobOperationFiller(SchedulerProvider)),
                   new DefaultRequestHandler(
                       new SingleParamRequestMatcher("command", "job-pause"),
                       new PauseJobFiller(SchedulerProvider)),
                   new DefaultRequestHandler(
                       new SingleParamRequestMatcher("command", "job-resume"),
                       new ResumeJobFiller(SchedulerProvider)),
                   new DefaultRequestHandler(
                       new SingleParamRequestMatcher("command", "trigger-pause"),
                       new PauseTriggerFiller(SchedulerProvider)),
                   new DefaultRequestHandler(
                       new SingleParamRequestMatcher("command", "trigger-resume"),
                       new ResumeTriggerFiller(SchedulerProvider)),
                   new DefaultRequestHandler(
                       new SingleParamRequestMatcher("command", "group-pause"),
                       new PauseGroupFiller(SchedulerProvider)),
                   new DefaultRequestHandler(
                       new SingleParamRequestMatcher("command", "group-resume"),
                       new ResumeGroupFiller(SchedulerProvider)),
                   new DefaultRequestHandler(
                       new CatchAllRequestMatcher(),
                       new HomeFiller(ViewEngine, SchedulerDataProvider))        
               };
        }
    }
}