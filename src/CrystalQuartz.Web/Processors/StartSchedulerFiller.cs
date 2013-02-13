namespace CrystalQuartz.Web.Processors
{
    using System.Web;
    using Core;
    using FrontController.ResponseFilling;

    public class StartSchedulerFiller : IResponseFiller
    {
        private readonly ISchedulerProvider _schedulerProvider;

        public StartSchedulerFiller(ISchedulerProvider schedulerProvider)
        {
            _schedulerProvider = schedulerProvider;
        }

        public void FillResponse(HttpResponseBase response, HttpContextBase context)
        {
            _schedulerProvider.Scheduler.Start();
            response.Redirect(context.Request.UrlReferrer.OriginalString);
        }
    }
}