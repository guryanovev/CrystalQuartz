using System.Web;

namespace CrystalQuartz.WebFramework.Routing
{
    public class CatchAllRequestMatcher : IRequestMatcher
    {
        public bool CanProcessRequest(HttpRequestBase request)
        {
            return true;
        }
    }
}