namespace CrystalQuartz.Web.Processors
{
    using System.Web;
    using Core.SchedulerProviders;
    using FrontController.ResponseFilling;

    public abstract class OperationFiller : IResponseFiller
    {
        protected readonly ISchedulerProvider _schedulerProvider;

        protected OperationFiller(ISchedulerProvider schedulerProvider)
        {
            _schedulerProvider = schedulerProvider;
        }

        public void FillResponse(HttpResponseBase response, HttpContextBase context)
        {
            DoAction(response, context);
            response.Redirect(context.Request.UrlReferrer.OriginalString);
        }

        protected abstract void DoAction(HttpResponseBase response, HttpContextBase context);
    }
}