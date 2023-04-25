namespace CrystalQuartz.WebFramework.Config
{
    using System.Reflection;
    using Utils;

    public class AppContext
    {
        private readonly Assembly _resourcesAssembly;
        private readonly string _defautResourcePrefix;
        private readonly IStreamWriterSessionProvider _streamWriterSessionProvider;

        public AppContext(Assembly resourcesAssembly, string defautResourcePrefix, IStreamWriterSessionProvider streamWriterSessionProvider)
        {
            _resourcesAssembly = resourcesAssembly;
            _defautResourcePrefix = defautResourcePrefix;
            _streamWriterSessionProvider = streamWriterSessionProvider;
        }

        public Assembly ResourcesAssembly
        {
            get { return _resourcesAssembly; }
        }

        public string DefautResourcePrefix
        {
            get { return _defautResourcePrefix; }
        }

        public IStreamWriterSessionProvider StreamWriterSessionProvider => _streamWriterSessionProvider;
    }
}