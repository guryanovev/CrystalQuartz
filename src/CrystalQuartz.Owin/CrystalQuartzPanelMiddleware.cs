using CrystalQuartz.Core;
using CrystalQuartz.Core.SchedulerProviders;

namespace CrystalQuartz.Owin
{
    using System;
    using System.Threading.Tasks;
    using CrystalQuartz.Application;
    using CrystalQuartz.WebFramework;
    using CrystalQuartz.WebFramework.HttpAbstractions;
    using Microsoft.Owin;
    using WebFramework.Utils;

    public class CrystalQuartzPanelMiddleware : OwinMiddleware
    {
        private readonly Lazy<Task<RunningApplication>> _runningApplicationLazy;
        private RunningApplication _runningApplication;

         public CrystalQuartzPanelMiddleware(
            OwinMiddleware next, 
            ISchedulerProvider schedulerProvider,
            Options options): base(next)
        {
            Application application = new CrystalQuartzPanelApplication(schedulerProvider, options);

            _runningApplicationLazy = new Lazy<Task<RunningApplication>>(application.Run);

            if (!options.LazyInit)
            {
                var value = _runningApplicationLazy.Value;
            }
        }

        public override async Task Invoke(IOwinContext context)
        {
            if (_runningApplication == null)
            {
                _runningApplication = await _runningApplicationLazy.Value;
            }

            IRequest owinRequest = new OwinRequest(context.Request.Query, await context.Request.ReadFormAsync());
            IResponseRenderer responseRenderer = new OwinResponseRenderer(context);

            await _runningApplication.Handle(owinRequest, responseRenderer);
        }
    }
}