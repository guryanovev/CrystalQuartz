namespace CrystalQuartz.WebFramework.SystemWeb
{
    using System.Web;
    using CrystalQuartz.WebFramework.HttpAbstractions;

    public class SystemWebRequest : IRequest
    {
        private readonly HttpContext _httpContext;

        public SystemWebRequest(HttpContext httpContext)
        {
            _httpContext = httpContext;
        }

        public string this[string key]
        {
            get { return _httpContext.Request.Params[key]; }
        }
    }
}