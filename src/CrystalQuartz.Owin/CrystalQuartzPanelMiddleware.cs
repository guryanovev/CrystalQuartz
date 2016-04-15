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

        public CrystalQuartzPanelMiddleware(OwinMiddleware next, ISchedulerProvider schedulerProvider): base(next)
        {
            schedulerProvider.Init();

            Application application = new CrystalQuartzPanelApplication(
                schedulerProvider,
                new DefaultSchedulerDataProvider(schedulerProvider), 
                null);

            _runningApplication = application.Run();
        }

        public override async Task Invoke(IOwinContext context)
        {
            if (context.Request.Uri.PathAndQuery.StartsWith("/CrystalQuartzPanel.axd", StringComparison.InvariantCultureIgnoreCase))
            {
                IRequest owinRequest = new OwinRequest(context.Request.Query, await context.Request.ReadFormAsync());
                IResponseRenderer responseRenderer = new OwinResponseRenderer(context);

                _runningApplication.Handle(owinRequest, responseRenderer);
            }
            else
            {
                await Next.Invoke(context);
            }
        }
    }
}