namespace CrystalQuartz.WebFramework
{
    using System.Linq;
    using System.Reflection;
    using CrystalQuartz.WebFramework.Config;
    using Utils;

    public abstract class Application : EmptyHandlerConfig
    {
        protected Application(
            Assembly resourcesAssembly,
            string defaultResourcesProfix,
            IStreamWriterSessionProvider streamWriterSessionProvider) : base(new AppContext(resourcesAssembly, defaultResourcesProfix, streamWriterSessionProvider))
        {
        }

        public abstract IHandlerConfig Config { get; }

        public RunningApplication Run()
        {
            return new RunningApplication(Config.Handlers.ToArray());
        }
    }
}