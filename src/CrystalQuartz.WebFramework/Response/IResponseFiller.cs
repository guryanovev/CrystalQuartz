using System.Web;

namespace CrystalQuartz.WebFramework.Response
{
    public interface IResponseFiller
    {
        void FillResponse(HttpResponseBase response, HttpContextBase context);
    }
}