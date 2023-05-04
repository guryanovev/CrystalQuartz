using System.Threading.Tasks;
using CrystalQuartz.Application;
using CrystalQuartz.Core;
using CrystalQuartz.Core.SchedulerProviders;
using CrystalQuartz.WebFramework;
using CrystalQuartz.WebFramework.HttpAbstractions;
using Microsoft.AspNetCore.Http;

namespace CrystalQuartz.AspNetCore
{
    using Microsoft.AspNetCore.Http.Features;

    public class CrystalQuartzPanelMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ISchedulerProvider _schedulerProvider;
        private readonly Options _options;
        private RunningApplication _runningApplication;

        public CrystalQuartzPanelMiddleware(
            RequestDelegate next,
            ISchedulerProvider schedulerProvider,
            Options options)
        {
            _next = next;
            _schedulerProvider = schedulerProvider;
            _options = options;
        }

        public async Task Init() // todo
        {
            if (!_options.LazyInit)
            {
                var application = new CrystalQuartzPanelApplication(_schedulerProvider, _options);
                _runningApplication = await application.Run();
            }
        }

        public async Task Invoke(HttpContext httpContext)
        {
            if (_options.LazyInit && _runningApplication == null)
            {
                var application = new CrystalQuartzPanelApplication(_schedulerProvider, _options);
                _runningApplication = await application.Run();
            }

            IRequest request = new AspNetCoreRequest(httpContext.Request.Query, httpContext.Request.HasFormContentType ? httpContext.Request.Form : null);
            IResponseRenderer responseRenderer = new AspNetCoreResponseRenderer(httpContext);

            await _runningApplication.Handle(request, responseRenderer);
        }
    }
}