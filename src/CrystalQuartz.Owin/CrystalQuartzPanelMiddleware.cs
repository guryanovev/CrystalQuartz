namespace CrystalQuartz.Owin
{
    using System;
    using System.IO;
    using System.Threading.Tasks;
    using System.Web;
    using CrystalQuartz.Core;
    using CrystalQuartz.Core.SchedulerProviders;
    using CrystalQuartz.Web;
    using Microsoft.Owin;

    public class CrystalQuartzPanelMiddleware : OwinMiddleware
    {
        private readonly PagesHandler _pagesHandler;

        public CrystalQuartzPanelMiddleware(OwinMiddleware next, ISchedulerProvider schedulerProvider): base(next)
        {
            schedulerProvider.Init();

            _pagesHandler = new PagesHandler(new CrystalQuartzPanelOptions(
                null,
                schedulerProvider,
                new DefaultSchedulerDataProvider(schedulerProvider)));
        }

        public override async Task Invoke(IOwinContext context)
        {
            
            if (context.Request.Uri.PathAndQuery.StartsWith("/CrystalQuartzPanel",
                StringComparison.InvariantCultureIgnoreCase))
            {
                HttpRequest request = new HttpRequest(null, context.Request.Uri.ToString(), context.Request.Uri.Query);

                using (var writer = new StreamWriter(context.Response.Body))
                {
                    HttpResponse httpResponse = new HttpResponse(writer);
                    _pagesHandler.ProcessRequest(new HttpContext(request, httpResponse));

                    context.Response.StatusCode = httpResponse.StatusCode;
                }
            }
            else
            {
                await Next.Invoke(context);
            }
        }
    }
}