namespace CrystalQuartz.Web.Processors
{
    using System.Web;
    using Core;
    using FrontController.ResponseFilling;

    public class PauseTriggerFiller: IResponseFiller
    {
        private readonly ISchedulerProvider _schedulerProvider;

        public PauseTriggerFiller(ISchedulerProvider schedulerProvider)
        {
            _schedulerProvider = schedulerProvider;
        }

        public void FillResponse(HttpResponseBase response, HttpContextBase context)
        {
            var trigger = context.Request.Params["trigger"];
            var jobGroup = context.Request.Params["group"];
            _schedulerProvider.Scheduler.PauseTrigger(trigger, jobGroup);
            response.Redirect(context.Request.UrlReferrer.OriginalString);
        }
    }
}