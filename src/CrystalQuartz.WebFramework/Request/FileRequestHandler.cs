using System.Reflection;
using System.Web;

namespace CrystalQuartz.WebFramework.Request
{
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