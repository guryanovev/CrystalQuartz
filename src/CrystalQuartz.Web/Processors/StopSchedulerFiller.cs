namespace CrystalQuartz.Web.Processors
{
    using System.Web;
    using Core;
    using FrontController.ResponseFilling;

    public class StopSchedulerFiller : IResponseFiller
    {
        private readonly ISchedulerProvider _schedulerProvider;

        public StopSchedulerFiller(ISchedulerProvider schedulerProvider)
        {
            _schedulerProvider = schedulerProvider;
        }

        public void FillResponse(HttpResponseBase response, HttpContextBase context)
        {
            _schedulerProvider.Scheduler.Shutdown(false);
            response.Redirect("/CrystalQuartzPanel.axd");
        }
    }
}