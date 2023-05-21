﻿namespace CrystalQuartz.WebFramework.Request
{
    using System.IO;
    using System.Reflection;
    using CrystalQuartz.WebFramework.HttpAbstractions;

    public abstract class AbstractFileRequestHandler : IRequestHandler
    {
        private readonly Assembly _resourcesAssembly;
        private readonly string _resourcePrefix;

        protected AbstractFileRequestHandler(Assembly resourcesAssembly, string resourcePrefix)
        {
            _resourcesAssembly = resourcesAssembly;
            _resourcePrefix = resourcePrefix;
        }

        public RequestHandlingResult WriteResourceToStream(string resourceName, IRequest request, string contentType)
        {
            var inputStream = _resourcesAssembly.GetManifestResourceStream(resourceName);

            if (inputStream == null)
            {
                return new RequestHandlingResult(true, new Response(null, 404, null)); // todo
            }

            return new RequestHandlingResult(
                true,
                new Response(contentType, 200, async outputStream =>
                {
                    await inputStream.CopyToAsync(outputStream);
                }));
        }

        public RequestHandlingResult HandleRequest(IRequest request)
        {
            return HandleRequest(request, GetPath(request));
        }

        protected abstract string? GetPath(IRequest context);

        protected RequestHandlingResult HandleRequest(IRequest request, string? initialPath)
        {
            if (string.IsNullOrEmpty(initialPath))
            {
                return RequestHandlingResult.NotHandled;
            }

            string path = initialPath!.StartsWith(_resourcePrefix) ? initialPath : _resourcePrefix + initialPath;
            string contentType = Path.GetExtension(path).ToLowerInvariant().Replace(".", string.Empty);

            return WriteResourceToStream(path, request, GetContentType(contentType));
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
    }
}