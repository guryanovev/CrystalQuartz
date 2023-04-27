namespace CrystalQuartz.WebFramework.Request
{
    using System.Web;
    using CrystalQuartz.WebFramework.HttpAbstractions;

    public class RequestHandlingResult
    {
        public static RequestHandlingResult NotHandled { get; } = new RequestHandlingResult(false, null);

        public bool IsHandled { get; }

        public Response Response { get; }

        public RequestHandlingResult(bool isHandled, Response response)
        {
            IsHandled = isHandled;
            Response = response;
        }
    }

    public interface IRequestHandler
    {
        RequestHandlingResult HandleRequest(IRequest request);
    }
}