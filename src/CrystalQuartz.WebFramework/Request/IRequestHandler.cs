namespace CrystalQuartz.WebFramework.Request
{
    using System.Web;

    public interface IRequestHandler
    {
        bool HandleRequest(HttpContextBase context);
    }
}