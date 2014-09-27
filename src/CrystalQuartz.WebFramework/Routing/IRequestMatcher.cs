namespace CrystalQuartz.WebFramework.Routing
{
    using System.Web;

    public interface IRequestMatcher
    {
        bool CanProcessRequest(HttpRequestBase request);
    }
}