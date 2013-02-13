namespace CrystalQuartz.Web.FrontController
{
    using System.Web;

    public interface IRequestHandler
    {
        bool HandleRequest(HttpContextBase context);
    }
}