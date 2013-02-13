namespace CrystalQuartz.Web.Processors
{
    using Core;
    using FrontController;
    using FrontController.ViewRendering;

    public class HomeFiller : MasterFiller
    {
        public HomeFiller(IViewEngine viewEngine, ISchedulerDataProvider schedulerDataProvider)
            : base(viewEngine, schedulerDataProvider)
        {
        }

        protected override void FillViewData(ViewData viewData)
        {
            viewData.Data["mainContent"] = "home";
        }
    }
}