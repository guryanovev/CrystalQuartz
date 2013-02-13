namespace CrystalQuartz.Web.Processors
{
    using System.Web;
    using Core;
    using FrontController.ResponseFilling;

    public class ResumeJobFiller: IResponseFiller
    {
        private readonly ISchedulerProvider _schedulerProvider;

        public ResumeJobFiller(ISchedulerProvider schedulerProvider)
        {
            _schedulerProvider = schedulerProvider;
        }

        public void FillResponse(HttpResponseBase response, HttpContextBase context)
        {
            var jobName = context.Request.Params["job"];
            var jobGroup = context.Request.Params["group"];
            _schedulerProvider.Scheduler.ResumeJob(jobName, jobGroup);
            response.Redirect(context.Request.UrlReferrer.OriginalString);
        }
    }
}