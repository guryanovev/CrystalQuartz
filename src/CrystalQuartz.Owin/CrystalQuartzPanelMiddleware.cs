using System;
using CrystalQuartz.Core.SchedulerProviders;

namespace CrystalQuartz.Owin
{
    using System.Threading.Tasks;
    using CrystalQuartz.Application;
    using CrystalQuartz.WebFramework;
    using CrystalQuartz.WebFramework.HttpAbstractions;
    using CrystalQuartz.WebFramework.Owin;
    using Microsoft.Owin;

    using OwinRequest = WebFramework.Owin.OwinRequest;

    public class CrystalQuartzPanelMiddleware : OwinMiddleware
    {
        private readonly RunningApplication _runningApplication;

        public CrystalQuartzPanelMiddleware(
            OwinMiddleware next, 
            Func<object> schedulerProvider,
            CrystalQuartzOptions options): base(next)
        {
            Application application = new CrystalQuartzPanelApplication(new FuncSchedulerProvider(schedulerProvider), options);

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