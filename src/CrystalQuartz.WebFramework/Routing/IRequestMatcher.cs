using System.Web;

namespace CrystalQuartz.WebFramework.Routing
{
    public interface IRequestMatcher
    {
        bool CanProcessRequest(HttpRequestBase request);
    }
}