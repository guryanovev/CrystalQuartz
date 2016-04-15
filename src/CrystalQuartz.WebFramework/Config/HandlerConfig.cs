namespace CrystalQuartz.WebFramework.Config
{
    using System.Collections.Generic;
    using CrystalQuartz.WebFramework.Request;
    using CrystalQuartz.WebFramework.Routing;

    public interface IHandlerConfig
    {
        IEnumerable<IRequestHandler> Handlers { get; }
        FillerConfig WhenCommand(string command);
        FillerConfig WhenPath(string path);
        FillerConfig Else();
    }

    public abstract class AbstractHandlerConfig : IHandlerConfig
    {
        private readonly AppContext _context;

        protected AbstractHandlerConfig(AppContext context)
        {
            _context = context;
        }

        protected virtual AppContext Context
        {
            get { return _context; }
        }

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

        public abstract IEnumerable<IRequestHandler> Handlers { get; }
    }

    public class EmptyHandlerConfig : AbstractHandlerConfig
    {
        public EmptyHandlerConfig(AppContext context) : base(context)
        {
        }

        public override IEnumerable<IRequestHandler> Handlers
        {
            get { yield break; }
        }
    }

    public class ConsHandlerConfig : AbstractHandlerConfig
    {
        private readonly IHandlerConfig _tail;
        private readonly IRequestHandler _handler;
        
        public ConsHandlerConfig(IHandlerConfig tail, IRequestHandler handler, AppContext appContext) : base(appContext)
        {
            _tail = tail;
            _handler = handler;
        }

        public override IEnumerable<IRequestHandler> Handlers
        {
            get
            {
                foreach (IRequestHandler handler in _tail.Handlers)
                {
                    yield return handler;
                }
                
                yield return SelfHandler;
            }
        }

        protected IRequestHandler SelfHandler
        {
            get { return _handler; }
        }
    }
}