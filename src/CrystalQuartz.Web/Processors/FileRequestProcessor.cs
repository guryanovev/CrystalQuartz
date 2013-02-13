namespace CrystalQuartz.Web.Processors
{
    using System;
    using System.IO;
    using System.Web;
    using FrontController;

    public class FileRequestProcessor : IRequestHandler
    {
        public bool HandleRequest(HttpContextBase context)
        {
            var path = context.Request.Params["file"];
            var type = context.Request.Params["type"];
            if (string.IsNullOrEmpty(path) || string.IsNullOrEmpty(type))
            {
                return false;
            }

            context.Response.ContentType = GetContentType(type);
            WriteResourceToStream(context.Response.OutputStream, path);
            return true;
        }

        private string GetContentType(string type)
        {
            switch (type)
            {
                case "css":
                    return "text/css";
                case "png":
                    return "image/png";
                default:
                    return string.Empty;
            }
        }

        public static void WriteResourceToStream(Stream outputStream, string resourceName)
        {
            var thisType = typeof(FileRequestProcessor);

            using (var inputStream = thisType.Assembly.GetManifestResourceStream(resourceName))
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
    }
}