namespace CrystalQuartz.WebFramework.Request
{
    using System;
    using System.IO;
    using System.Reflection;
    using System.Web;

    public abstract class AbstractFileRequestHandler : IRequestHandler
    {
        private readonly Assembly _resourcesAssembly;
        private readonly string _resourcePrefix;

        protected AbstractFileRequestHandler(Assembly resourcesAssembly, string resourcePrefix)
        {
            _resourcesAssembly = resourcesAssembly;
            _resourcePrefix = resourcePrefix;
        }

        protected bool HandleRaquest(HttpContextBase context, string initialPath)
        {
            if (string.IsNullOrEmpty(initialPath))
            {
                return false;
            }

            var path = initialPath.StartsWith(_resourcePrefix) ? initialPath : _resourcePrefix + initialPath;
            var contentType = Path.GetExtension(path).ToLowerInvariant().Replace(".", string.Empty);

            context.Response.ContentType = GetContentType(contentType);
            WriteResourceToStream(context.Response.OutputStream, path, context);
            return true;
        }

        public void WriteResourceToStream(Stream outputStream, string resourceName, HttpContextBase context)
        {
            using (var inputStream = _resourcesAssembly.GetManifestResourceStream(resourceName))
            {
                if (inputStream == null)
                {
                    context.Response.StatusCode = 404;
                    return;
                }

                var buffer = new byte[Math.Min(inputStream.Length, 4096)];
                var readLength = inputStream.Read(buffer, 0, buffer.Length);

                while (readLength > 0)
                {
                    outputStream.Write(buffer, 0, readLength);
                    readLength = inputStream.Read(buffer, 0, buffer.Length);
                }
            }
        }

        private string GetContentType(string type)
        {
            switch (type)
            {
                case "css":
                    return "text/css";
                case "gif":
                    return "image/gif";
                case "png":
                    return "image/png";
                case "html":
                    return "text/html";
                case "js":
                    return "application/javascript";
                case "woff":
                    return "application/font-woff";
                default:
                    return string.Empty;
            }
        }

        public bool HandleRequest(HttpContextBase context)
        {
            return HandleRaquest(context, GetPath(context));
        }

        protected abstract string GetPath(HttpContextBase context);
    }
}