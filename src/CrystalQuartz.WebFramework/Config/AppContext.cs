namespace CrystalQuartz.WebFramework.Config
{
    using System.Reflection;

    public class AppContext
    {
        private readonly Assembly _resourcesAssembly;
        private readonly string _defautResourcePrefix;

        public AppContext(Assembly resourcesAssembly, string defautResourcePrefix)
        {
            _resourcesAssembly = resourcesAssembly;
            _defautResourcePrefix = defautResourcePrefix;
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