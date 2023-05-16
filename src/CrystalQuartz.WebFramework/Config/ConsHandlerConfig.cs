namespace CrystalQuartz.WebFramework.Config
{
    using System.Collections.Generic;
    using CrystalQuartz.WebFramework.Request;

    public class ConsHandlerConfig : AbstractHandlerConfig
    {
        private readonly IHandlerConfig _tail;
        private readonly IRequestHandler _handler;

        public ConsHandlerConfig(IHandlerConfig tail, IRequestHandler handler, AppContext appContext)
            : base(appContext)
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