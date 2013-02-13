namespace CrystalQuartz.Web.Processors
{
    using Core;
    using FrontController;
    using FrontController.ViewRendering;

    public class JobFiller : MasterFiller
    {
        public JobFiller(IViewEngine viewEngine, ISchedulerDataProvider schedulerDataProvider)
            : base(viewEngine, schedulerDataProvider)
        {
        }

        protected override void FillViewData(ViewData viewData)
        {
            var jobName = Request.Params["job"];
            var jobGroup = Request.Params["group"];
            viewData.Data["mainContent"] = "job";
            viewData.Data["jobDetails"] = _schedulerDataProvider.GetJobDetailsData(jobName, jobGroup);
        }
    }
}