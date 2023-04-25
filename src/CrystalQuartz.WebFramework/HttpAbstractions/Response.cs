namespace CrystalQuartz.WebFramework.HttpAbstractions
{
    using System;
    using System.IO;
    using System.Threading.Tasks;

    public class Response
    {
        public Response(string contentType, int statusCode, Func<Stream, Task> contentFiller)
        {
            ContentType = contentType;
            StatusCode = statusCode;
            ContentFiller = contentFiller;
        }

        public string ContentType { get; }

        public int StatusCode { get; }

        public Func<Stream, Task> ContentFiller { get; }
    }
}