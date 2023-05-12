namespace CrystalQuartz.WebFramework.Response
{
    using System.IO;
    using System.Threading.Tasks;
    using CrystalQuartz.WebFramework.HttpAbstractions;

    public abstract class DefaultResponseFiller : IResponseFiller
    {
        public virtual string ContentType => "text/html";

        public virtual int StatusCode => 200;

        public Response FillResponse(IRequest request)
        {
            return new Response(ContentType, StatusCode, stream => InternalFillResponse(stream, request));
        }

        protected abstract Task InternalFillResponse(Stream outputStream, IRequest request);
    }
}