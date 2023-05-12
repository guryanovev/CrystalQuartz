namespace CrystalQuartz.WebFramework
{
    using System;
    using System.Linq;
    using System.Reflection;
    using CrystalQuartz.WebFramework.Config;
    using AppContext = CrystalQuartz.WebFramework.Config.AppContext;

    public abstract class Application : EmptyHandlerConfig
    {
        private readonly Action<Exception> _errorAction;

        protected Application(
            Assembly resourcesAssembly,
            string defaultResourcesPrefix,
            Action<Exception> errorAction)
            : base(new AppContext(resourcesAssembly, defaultResourcesPrefix))
        {
            _errorAction = errorAction;
        }

        public abstract IHandlerConfig Configure();

        public virtual IRunningApplication Run()
        {
            return new RunningApplication(Configure().Handlers.ToArray(), _errorAction);
        }
    }
}