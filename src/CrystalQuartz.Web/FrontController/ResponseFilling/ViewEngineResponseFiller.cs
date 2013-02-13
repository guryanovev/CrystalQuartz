namespace CrystalQuartz.Web.FrontController.ResponseFilling
{
    using System.Web;
    using ViewRendering;

    public abstract class ViewEngineResponseFiller : DefaultResponseFiller
    {
        private readonly IViewEngine _viewEngine;

        protected ViewEngineResponseFiller(IViewEngine viewEngine)
        {
            _viewEngine = viewEngine;
        }

        protected override void InternalFillResponse(HttpResponseBase response, HttpContextBase context)
        {
            var viewData = GetViewData();
            _viewEngine.RenderView(viewData.ViewName, viewData.Data, response.OutputStream);
        }

        protected abstract ViewData GetViewData();
    }
}