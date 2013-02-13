namespace CrystalQuartz.Web.FrontController.RequestMatching
{
    using System.Web;

    public interface IRequestMatcher
    {
        bool CanProcessRequest(HttpRequestBase request);
    }
}