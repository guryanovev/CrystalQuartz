namespace CrystalQuartz.WebFramework.Request
{
    using System.Reflection;
    using System.Web;

    public class FileRequestHandler : AbstractFileRequestHandler
    {
        public FileRequestHandler(Assembly resourcesAssembly, string resourcePrefix) : base(resourcesAssembly, resourcePrefix)
        {
        }

        protected override string GetPath(HttpContextBase context)
        {
            return context.Request.Params["path"];
        }
    }
}