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
        private readonly Lazy<Task<RunningApplication>> _runningApplicationLazy;
        private RunningApplication _runningApplication;

        public CrystalQuartzPanelMiddleware(
            RequestDelegate next,
            ISchedulerProvider schedulerProvider,
            Options options)
        {
            Application application = new CrystalQuartzPanelApplication(schedulerProvider, options);

            _runningApplicationLazy = new Lazy<Task<RunningApplication>>(application.Run);

            if (!options.LazyInit)
            {
                var value = _runningApplicationLazy.Value;
            }
        }

        public async Task Invoke(HttpContext httpContext)
        {
            _runningApplication ??= await _runningApplicationLazy.Value;

            IRequest request = new AspNetCoreRequest(httpContext.Request.Query, httpContext.Request.HasFormContentType ? httpContext.Request.Form : null);
            IResponseRenderer responseRenderer = new AspNetCoreResponseRenderer(httpContext);

            await _runningApplication.Handle(request, responseRenderer);
        }
    }
}