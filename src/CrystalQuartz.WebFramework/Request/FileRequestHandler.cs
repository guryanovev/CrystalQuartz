namespace CrystalQuartz.WebFramework.Request
{
    using System.Reflection;
    using CrystalQuartz.WebFramework.HttpAbstractions;

    public class FileRequestHandler : AbstractFileRequestHandler
    {
        public FileRequestHandler(Assembly resourcesAssembly, string resourcePrefix)
            : base(resourcesAssembly, resourcePrefix)
        {
        }

        protected override string? GetPath(IRequest request)
        {
            return request["path"]?.TrimStart('/'); // We only need this Trim call because of the bug https://github.com/jantimon/html-webpack-plugin/issues/694
        }
    }
}