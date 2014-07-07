using System;
using System.IO;
using System.Reflection;
using System.Web;

namespace CrystalQuartz.WebFramework.Request
{
    public class FileRequestHandler : IRequestHandler
    {
        private readonly Assembly _resourcesAssembly;
        private readonly string _resourcePrefix;

        public FileRequestHandler(Assembly resourcesAssembly, string resourcePrefix)
        {
            _resourcesAssembly = resourcesAssembly;
            _resourcePrefix = resourcePrefix;
        }

        public bool HandleRequest(HttpContextBase context)
        {
            var initialPath = context.Request.Params["path"];
            if (string.IsNullOrEmpty(initialPath))
            {
                return false;
            }

            var path = initialPath.StartsWith(_resourcePrefix) ? initialPath : _resourcePrefix + initialPath;
            var contentType = Path.GetExtension(path).ToLowerInvariant().Replace(".", string.Empty);

            context.Response.ContentType = GetContentType(contentType);
            WriteResourceToStream(context.Response.OutputStream, path);
            return true;
        }

        public void WriteResourceToStream(Stream outputStream, string resourceName)
        {
            using (var inputStream = _resourcesAssembly.GetManifestResourceStream(resourceName))
            {
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
                case "png":
                    return "image/png";
                case "html":
                    return "text/html";
                case "js":
                    return "application/javascript";
                default:
                    return string.Empty;
            }
        }
    }
}