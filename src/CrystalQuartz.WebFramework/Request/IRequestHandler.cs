namespace CrystalQuartz.WebFramework.Request
{
    using System.Web;
    using CrystalQuartz.WebFramework.HttpAbstractions;

    public class RequestHandlingResult
    {
        private readonly bool _isHandled;
        private readonly Response _response;

        public static RequestHandlingResult NotHandled
        {
            get { return new RequestHandlingResult(false, null); }
        }

        public bool IsHandled
        {
            get { return _isHandled; }
        }

        public Response Response
        {
            get { return _response; }
        }

        public RequestHandlingResult(bool isHandled, Response response)
        {
            _isHandled = isHandled;
            _response = response;
        }
    }

    public interface IRequestHandler
    {
        RequestHandlingResult HandleRequest(IRequest request);
    }
}