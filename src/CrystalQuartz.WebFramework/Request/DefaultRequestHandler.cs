namespace CrystalQuartz.WebFramework.Request
{
    using CrystalQuartz.WebFramework.HttpAbstractions;
    using CrystalQuartz.WebFramework.Response;
    using CrystalQuartz.WebFramework.Routing;

    public class DefaultRequestHandler : IRequestHandler
    {
        private readonly IRequestMatcher _matcher;
        private readonly IResponseFiller _responseFiller;

        public DefaultRequestHandler(IRequestMatcher matcher, IResponseFiller responseFiller)
        {
            _matcher = matcher;
            _responseFiller = responseFiller;
        }

        public RequestHandlingResult HandleRequest(IRequest request)
        {
            if (_matcher.CanProcessRequest(request))
            {
                Response response = _responseFiller.FillResponse(request);
                return new RequestHandlingResult(true, response);
            }

            return RequestHandlingResult.NotHandled;
        }
    }
}