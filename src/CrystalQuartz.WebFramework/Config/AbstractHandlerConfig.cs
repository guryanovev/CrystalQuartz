namespace CrystalQuartz.WebFramework.Config
{
    using System.Collections.Generic;
    using CrystalQuartz.WebFramework.Request;
    using CrystalQuartz.WebFramework.Routing;

    public abstract class AbstractHandlerConfig : IHandlerConfig
    {
        private readonly AppContext _context;

        protected AbstractHandlerConfig(AppContext context)
        {
            _context = context;
        }

        public abstract IEnumerable<IRequestHandler> Handlers { get; }

        protected virtual AppContext Context => _context;

        public IHandlerConfig WithHandler(IRequestHandler handler)
        {
            return new ConsHandlerConfig(this, handler, _context);
        }

        public FillerConfig WhenCommand(string command)
        {
            return new FillerConfig(
                new SingleParamRequestMatcher("command", command),
                this,
                _context);
        }

        public FillerConfig WhenPath(string path)
        {
            return new FillerConfig(
                new SingleParamRequestMatcher("path", path),
                this,
                _context);
        }

        public FillerConfig Else()
        {
            return new FillerConfig(new CatchAllRequestMatcher(), this, _context);
        }
    }
}