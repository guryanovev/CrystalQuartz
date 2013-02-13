namespace CrystalQuartz.Web.FrontController.ResponseFilling
{
    using System.Web;

    public interface IResponseFiller
    {
        void FillResponse(HttpResponseBase response, HttpContextBase context);
    }
}