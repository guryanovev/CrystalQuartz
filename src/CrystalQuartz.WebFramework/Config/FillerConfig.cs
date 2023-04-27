using CrystalQuartz.WebFramework.Serialization;

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

        public FillerConfig(
            IRequestMatcher matcher,
            IHandlerConfig parent,
            AppContext context)
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

        public IHandlerConfig Do<TInput, TOutput>(
            AbstractCommand<TInput, TOutput> command, 
            ISerializer<TOutput> serializer) 
                where TInput : new() where TOutput : CommandResult, new()
        {
            return Do<TInput>(input => new SerializationBasedResponseFiller<TOutput>(serializer, "application/json",
                command.Execute(input).ContinueWith(r => (TOutput) r.Result)));
        }

        public IHandlerConfig MapTo(string path)
        {
            var handler = new SingleFileRequestHandler(_context.ResourcesAssembly, _context.DefautResourcePrefix, path);
            return new ConsHandlerConfig(_parent, handler, _context);
        }
    }
}