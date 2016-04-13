namespace CrystalQuartz.Owin
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Threading.Tasks;
    using System.Web;
    using CrystalQuartz.Core;
    using CrystalQuartz.Core.SchedulerProviders;
    using CrystalQuartz.Web;
    using CrystalQuartz.WebFramework.HttpAbstractions;
    using CrystalQuartz.WebFramework.Request;
    using Microsoft.Owin;

    public class CrystalQuartzPanelMiddleware : OwinMiddleware
    {
        private IList<IRequestHandler> _handlers;

        public CrystalQuartzPanelMiddleware(OwinMiddleware next, ISchedulerProvider schedulerProvider): base(next)
        {
            schedulerProvider.Init();

            var handlers = new CrystalQuartzPanelApplication(
                schedulerProvider,
                new DefaultSchedulerDataProvider(schedulerProvider), 
                null).Config.Handlers;

            var result = new List<IRequestHandler>();
            result.Add(new FileRequestHandler(typeof(PagesHandler).Assembly, "CrystalQuartz.Web.Content."));
            result.AddRange(handlers);

            _handlers = result;
        }

        public override async Task Invoke(IOwinContext context)
        {
            if (context.Request.Uri.PathAndQuery.StartsWith("/CrystalQuartzPanel.axd", StringComparison.InvariantCultureIgnoreCase))
            {
                IRequest owinRequest = new OwinRequest(context.Request.Query, await context.Request.ReadFormAsync());

                foreach (IRequestHandler handler in _handlers)
                {
                    RequestHandlingResult result = handler.HandleRequest(owinRequest);
                    if (result.IsHandled)
                    {
                        context.Response.StatusCode = result.Response.StatusCode;
                        context.Response.ContentType = result.Response.ContentType;
                        if (result.Response.ContentFiller != null)
                        {
                            result.Response.ContentFiller.Invoke(context.Response.Body);
                        }

                        return;
                    }
                }
            }
            else
            {
                await Next.Invoke(context);
            }
        }
    }

    public class OwinRequest : IRequest
    {
        private readonly IReadableStringCollection _query;
        private readonly IFormCollection _body;

        public OwinRequest(IReadableStringCollection query, IFormCollection body)
        {
            _query = query;
            _body = body;
        }

        public string this[string key]
        {
            get { return _query[key] ?? _body[key]; }
        }
    }
}