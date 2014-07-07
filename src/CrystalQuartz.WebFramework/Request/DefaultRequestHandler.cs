using System.Web;
using CrystalQuartz.WebFramework.Response;
using CrystalQuartz.WebFramework.Routing;

namespace CrystalQuartz.WebFramework.Request
{
    public class DefaultRequestHandler : IRequestHandler
    {
        private readonly IRequestMatcher _matcher;
        private readonly IResponseFiller _responseFiller;

        public DefaultRequestHandler(IRequestMatcher matcher, IResponseFiller responseFiller)
        {
            _matcher = matcher;
            _responseFiller = responseFiller;
        }

        public bool HandleRequest(HttpContextBase context)
        {
            if (_matcher.CanProcessRequest(context.Request))
            {
                _responseFiller.FillResponse(context.Response, context);
                return true;
            }

            return false;
        }
    }
}