namespace CrystalQuartz.Web.Processors
{
    using System;
    using Core;
    using FrontController;
    using FrontController.ResponseFilling;
    using FrontController.ViewRendering;
    using Helpers;

    public abstract class MasterFiller : ViewEngineResponseFiller
    {
        protected readonly ISchedulerDataProvider _schedulerDataProvider;

        protected MasterFiller(IViewEngine viewEngine, ISchedulerDataProvider schedulerDataProvider) : base(viewEngine)
        {
            _schedulerDataProvider = schedulerDataProvider;
        }

        protected override ViewData GetViewData()
        {
            try
            {
                var viewData = new ViewData("master");
                viewData.Data["data"] = _schedulerDataProvider.Data;
                viewData.Data["currentDate"] = DateTime.Now.ToUniversalTime();
                FillViewData(viewData);
                return viewData;
            }
            catch (Exception ex)
            {
                var viewData = new ViewData("error");
                viewData.Data["errorMessage"] = ex.FullMessage();
                viewData.Data["exception"] = ex;
                return viewData;
            }
        }

        protected abstract void FillViewData(ViewData viewData);
    }
}