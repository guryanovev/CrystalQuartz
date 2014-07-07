using System.Web;
using CrystalQuartz.Web.FrontController.ResponseFilling;

namespace CrystalQuartz.WebFramework.Response
{
    public abstract class ViewEngineResponseFiller : DefaultResponseFiller
    {
//        private readonly IViewEngine _viewEngine;
//
//        protected ViewEngineResponseFiller(IViewEngine viewEngine)
//        {
//            _viewEngine = viewEngine;
//        }

        protected override void InternalFillResponse(HttpResponseBase response, HttpContextBase context)
        {
//            var viewData = GetViewData();
//            _viewEngine.RenderView(viewData.ViewName, viewData.Data, response.OutputStream);
        }

//        protected abstract ViewData GetViewData();
    }
}