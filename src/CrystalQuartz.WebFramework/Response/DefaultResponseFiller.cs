namespace CrystalQuartz.WebFramework.Response
{
    using System.IO;
    using System.Web;
    using CrystalQuartz.WebFramework.HttpAbstractions;

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

        public Response FillResponse(IRequest request)
        {
            return new Response(ContentType, StatusCode, stream => InternalFillResponse(stream, request));
        }

        protected abstract void InternalFillResponse(Stream outputStream, IRequest request);
    }
}