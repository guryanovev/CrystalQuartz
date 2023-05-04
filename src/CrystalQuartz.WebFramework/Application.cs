namespace CrystalQuartz.WebFramework
{
    using System;
    using System.Linq;
    using System.Reflection;
    using System.Threading.Tasks;
    using CrystalQuartz.WebFramework.Config;
    using Utils;
    using AppContext = Config.AppContext;

    public abstract class Application : EmptyHandlerConfig
    {
        private readonly Action<Exception> _errorAction;

        protected Application(
            Assembly resourcesAssembly,
            string defaultResourcesPrefix,
            Action<Exception> errorAction) : base(new AppContext(resourcesAssembly, defaultResourcesPrefix))
        {
            _errorAction = errorAction;
        }

        public abstract Task<IHandlerConfig> Configure();

        public async Task<RunningApplication> Run()
        {
            return new RunningApplication((await Configure()).Handlers.ToArray(), _errorAction);
        }
    }
}