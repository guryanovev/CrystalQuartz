namespace CrystalQuartz.Owin
{
    using System;
    using System.Threading.Tasks;
    using CrystalQuartz.Application;
    using CrystalQuartz.Core;
    using CrystalQuartz.Core.SchedulerProviders;
    using CrystalQuartz.WebFramework;
    using CrystalQuartz.WebFramework.HttpAbstractions;
    using CrystalQuartz.WebFramework.Owin;
    using Microsoft.Owin;

    using OwinRequest = CrystalQuartz.WebFramework.Owin.OwinRequest;

    public class CrystalQuartzPanelMiddleware : OwinMiddleware
    {
        private readonly RunningApplication _runningApplication;

        public CrystalQuartzPanelMiddleware(
            OwinMiddleware next, 
            ISchedulerProvider schedulerProvider,
            CrystalQuartzOptions options): base(next)
        {
            Application application = new CrystalQuartzPanelApplication(
                schedulerProvider,
                new DefaultSchedulerDataProvider(schedulerProvider), 
                options);

            _runningApplication = application.Run();
        }

        public override async Task Invoke(IOwinContext context)
        {
            IRequest owinRequest = new OwinRequest(context.Request.Query, await context.Request.ReadFormAsync());
            IResponseRenderer responseRenderer = new OwinResponseRenderer(context);

            _runningApplication.Handle(owinRequest, responseRenderer);
        }
    }
}