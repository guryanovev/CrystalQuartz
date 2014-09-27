namespace CrystalQuartz.WebFramework.Config
{
    using System;
    using CrystalQuartz.WebFramework.Commands;
    using CrystalQuartz.WebFramework.Request;
    using CrystalQuartz.WebFramework.Response;
    using CrystalQuartz.WebFramework.Routing;

    public class FillerConfig
    {
        private readonly IRequestMatcher _matcher;
        private readonly IHandlerConfig _parent;
        private readonly AppContext _context;

        public FillerConfig(IRequestMatcher matcher, IHandlerConfig parent, AppContext context)
        {
            _matcher = matcher;
            _parent = parent;
            _context = context;
        }

        public IHandlerConfig Do<TInput>(Func<TInput, IResponseFiller> action) where TInput : new()
        {
            var handler = new DefaultRequestHandler(
                _matcher,
                new ArgumentAwareResponseFiller<TInput>(action));

            return new ConsHandlerConfig(_parent, handler, _context);
        }

        public IHandlerConfig Do<TInput>(ICommand<TInput> command) where TInput : new()
        {
            return Do<TInput>(input => new JsonResponseFiller(command.Execute(input), _context.JavaScriptSerializer));
        }

        public IHandlerConfig MapTo(string path)
        {
            var handler = new SingleFileRequestHandler(_context.ResourcesAssembly, _context.DefautResourcePrefix, path);
            return new ConsHandlerConfig(_parent, handler, _context);
        }
    }
}