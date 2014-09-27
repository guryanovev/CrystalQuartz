namespace CrystalQuartz.WebFramework.Config
{
    using System.Reflection;
    using System.Web.Script.Serialization;

    public class AppContext
    {
        private readonly JavaScriptSerializer _javaScriptSerializer;
        private readonly Assembly _resourcesAssembly;
        private readonly string _defautResourcePrefix;

        public AppContext(JavaScriptSerializer javaScriptSerializer, Assembly resourcesAssembly, string defautResourcePrefix)
        {
            _javaScriptSerializer = javaScriptSerializer;
            _resourcesAssembly = resourcesAssembly;
            _defautResourcePrefix = defautResourcePrefix;
        }

        public JavaScriptSerializer JavaScriptSerializer
        {
            get { return _javaScriptSerializer; }
        }

        public Assembly ResourcesAssembly
        {
            get { return _resourcesAssembly; }
        }

        public string DefautResourcePrefix
        {
            get { return _defautResourcePrefix; }
        }
    }
}