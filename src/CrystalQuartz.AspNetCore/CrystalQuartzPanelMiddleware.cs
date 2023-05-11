using System.Threading.Tasks;
using CrystalQuartz.Application;
using CrystalQuartz.Core;
using CrystalQuartz.Core.SchedulerProviders;
using CrystalQuartz.WebFramework;
using CrystalQuartz.WebFramework.HttpAbstractions;
using Microsoft.AspNetCore.Http;

namespace CrystalQuartz.AspNetCore
{
    using System;
    using Microsoft.AspNetCore.Http.Features;
    using Application = WebFramework.Application;

    public class CrystalQuartzPanelMiddleware
    {
        private readonly IRunningApplication _runningApplication;

        public CrystalQuartzPanelMiddleware(
            RequestDelegate next,
            ISchedulerProvider schedulerProvider,
            Options options)
        {
            _runningApplication = new CrystalQuartzPanelApplication(schedulerProvider, options).Run();
        }

        public async Task Invoke(HttpContext httpContext)
        {
            IRequest request = new AspNetCoreRequest(httpContext.Request.Query, httpContext.Request.HasFormContentType ? httpContext.Request.Form : null);
            IResponseRenderer responseRenderer = new AspNetCoreResponseRenderer(httpContext);

            await _runningApplication.Handle(request, responseRenderer);
        }
    }
}