namespace CrystalQuartz.Web.Processors
{
    using System.Web;
    using Core;
    using FrontController.ResponseFilling;

    public class ResumeGroupFiller : IResponseFiller
    {
        private readonly ISchedulerProvider _schedulerProvider;

        public ResumeGroupFiller(ISchedulerProvider schedulerProvider)
        {
            _schedulerProvider = schedulerProvider;
        }

        public void FillResponse(HttpResponseBase response, HttpContextBase context)
        {
            var jobGroup = context.Request.Params["group"];
            _schedulerProvider.Scheduler.ResumeJobGroup(jobGroup);
            response.Redirect(context.Request.UrlReferrer.OriginalString);
        }
    }
}