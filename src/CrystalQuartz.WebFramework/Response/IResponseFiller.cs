namespace CrystalQuartz.WebFramework.Response
{
    using System.Web;

    public interface IResponseFiller
    {
        void FillResponse(HttpResponseBase response, HttpContextBase context);
    }
}