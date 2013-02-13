namespace CrystalQuartz.Web.Processors
{
    using System.Web;
    using Core;
    using FrontController.ResponseFilling;

    public class ResumeTriggerFiller: IResponseFiller
    {
        private readonly ISchedulerProvider _schedulerProvider;

        public ResumeTriggerFiller(ISchedulerProvider schedulerProvider)
        {
            _schedulerProvider = schedulerProvider;
        }

        public void FillResponse(HttpResponseBase response, HttpContextBase context)
        {
            var trigger = context.Request.Params["trigger"];
            var jobGroup = context.Request.Params["group"];
            _schedulerProvider.Scheduler.ResumeTrigger(trigger, jobGroup);
            response.Redirect(context.Request.UrlReferrer.OriginalString);
        }
    }
}