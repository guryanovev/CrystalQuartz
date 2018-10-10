namespace CrystalQuartz.WebFramework.SystemWeb
{
    using System.Collections.Generic;
    using System.Web;
    using CrystalQuartz.WebFramework.HttpAbstractions;

    public class SystemWebRequest : IRequest
    {
        private readonly HttpContext _httpContext;

        public SystemWebRequest(HttpContext httpContext)
        {
            _httpContext = httpContext;
        }

        public IEnumerable<string> AllKeys => _httpContext.Request.Params.AllKeys;

        public string this[string key] => _httpContext.Request.Params[key];
    }
}