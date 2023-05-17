namespace CrystalQuartz.Owin
{
    using System.Threading.Tasks;
    using CrystalQuartz.Application;
    using CrystalQuartz.Core;
    using CrystalQuartz.Core.SchedulerProviders;
    using CrystalQuartz.WebFramework;
    using CrystalQuartz.WebFramework.HttpAbstractions;
    using Microsoft.Owin;

    public class CrystalQuartzPanelMiddleware : OwinMiddleware
    {
        private readonly IRunningApplication _runningApplication;

        public CrystalQuartzPanelMiddleware(
            OwinMiddleware next,
            ISchedulerProvider schedulerProvider,
            Options options)
            : base(next)
        {
            _runningApplication = new CrystalQuartzPanelApplication(schedulerProvider, options).Run();
        }

        public override async Task Invoke(IOwinContext context)
        {
            IRequest owinRequest = new OwinRequest(
                context.Request.Query,
                await context.Request.ReadFormAsync());

            IResponseRenderer responseRenderer = new OwinResponseRenderer(context);

            await _runningApplication.Handle(owinRequest, responseRenderer);
        }
    }
}