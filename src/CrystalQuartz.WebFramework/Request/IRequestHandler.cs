using System.Web;

namespace CrystalQuartz.WebFramework.Request
{
    public interface IRequestHandler
    {
        bool HandleRequest(HttpContextBase context);
    }
}