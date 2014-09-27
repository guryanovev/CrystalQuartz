namespace CrystalQuartz.WebFramework.Routing
{
    using System.Web;

    public class CatchAllRequestMatcher : IRequestMatcher
    {
        public bool CanProcessRequest(HttpRequestBase request)
        {
            return true;
        }
    }
}