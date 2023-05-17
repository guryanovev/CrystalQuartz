namespace CrystalQuartz.WebFramework.Request
{
    using CrystalQuartz.WebFramework.HttpAbstractions;

    public class RequestHandlingResult
    {
        public RequestHandlingResult(bool isHandled, Response response)
        {
            IsHandled = isHandled;
            Response = response;
        }

        public static RequestHandlingResult NotHandled { get; } = new RequestHandlingResult(false, null);

        public bool IsHandled { get; }

        public Response Response { get; }
    }
}