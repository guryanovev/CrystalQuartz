namespace CrystalQuartz.WebFramework.HttpAbstractions
{
    using System;
    using System.IO;

    public class Response
    {
        private readonly string _contentType;
        private readonly int _statusCode;
        private readonly Action<Stream> _contentFiller;

        public Response(string contentType, int statusCode, Action<Stream> contentFiller)
        {
            _contentType = contentType;
            _statusCode = statusCode;
            _contentFiller = contentFiller;
        }

        public string ContentType
        {
            get { return _contentType; }
        }

        public int StatusCode
        {
            get { return _statusCode; }
        }

        public Action<Stream> ContentFiller
        {
            get { return _contentFiller; }
        }
    }
}