namespace CrystalQuartz.Web.FrontController.RequestMatching
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