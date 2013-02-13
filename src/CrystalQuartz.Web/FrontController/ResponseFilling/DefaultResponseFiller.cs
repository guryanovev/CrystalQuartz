namespace CrystalQuartz.Web.FrontController.ResponseFilling
{
    using System.Web;

    public abstract class DefaultResponseFiller : IResponseFiller
    {
        public virtual string ContentType
        {
            get
            {
                return "text/html";
            }
        }

        public virtual int StatusCode
        {
            get
            {
                return 200;
            }
        }

        protected HttpRequestBase Request { get; private set; }

        public void FillResponse(HttpResponseBase response, HttpContextBase context)
        {
            Request = context.Request;

            response.ContentType = ContentType;
            response.StatusCode = StatusCode;
            InternalFillResponse(response, context);
        }

        protected abstract void InternalFillResponse(HttpResponseBase response, HttpContextBase context);
    }
}