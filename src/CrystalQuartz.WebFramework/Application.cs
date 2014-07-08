using System;
using System.Collections.Generic;
using System.Web.Script.Serialization;
using CrystalQuartz.WebFramework.Commands;
using CrystalQuartz.WebFramework.Request;
using CrystalQuartz.WebFramework.Response;
using CrystalQuartz.WebFramework.Routing;

namespace CrystalQuartz.WebFramework
{
    public abstract class Application : RouteConfig
    {
        private readonly JavaScriptSerializer _javaScriptSerializer;

        protected Application()
        {
            _javaScriptSerializer = new JavaScriptSerializer();
        }

        public abstract RouteConfig Config { get; }

        public override JavaScriptSerializer JavaScriptSerializer
        {
            get { return _javaScriptSerializer; }
        }

        protected IResponseFiller Json(object model)
        {
            return new JsonResponseFiller(model, JavaScriptSerializer);
        }

        protected IResponseFiller View(object model)
        {
            return null;
        }

        public override IList<IRequestHandler> CreateHandlers()
        {
            return new List<IRequestHandler>();
        }
    }

    public abstract class RouteConfig
    {
        public ActionConfig When(string urlPattern)
        {
            return new ActionConfig(urlPattern, this, JavaScriptSerializer);
        }

        public abstract IList<IRequestHandler> CreateHandlers();

        public abstract JavaScriptSerializer JavaScriptSerializer { get; }
    }

    public abstract class NonEmptyRouteConfig : RouteConfig
    {
        private readonly RouteConfig _parent;

        protected NonEmptyRouteConfig(RouteConfig parent)
        {
            _parent = parent;
        }

        public override IList<IRequestHandler> CreateHandlers()
        {
            var parentHandlers = _parent.CreateHandlers();
            AddInternalRequestHandlers(parentHandlers);

            return parentHandlers;
        }

        protected abstract void AddInternalRequestHandlers(IList<IRequestHandler> handlers);

        public override JavaScriptSerializer JavaScriptSerializer
        {
            get { return _parent.JavaScriptSerializer; }
        }
    }

    public class ActionRouteConfig<T> : NonEmptyRouteConfig where T : new()
    {
        private readonly string _command;
        private readonly Func<T, IResponseFiller> _action;

        public ActionRouteConfig(RouteConfig parent, string command, Func<T, IResponseFiller> action) : base(parent)
        {
            _command = command;
            _action = action;
        }

        protected override void AddInternalRequestHandlers(IList<IRequestHandler> handlers)
        {
            handlers.Add(new DefaultRequestHandler(
                new SingleParamRequestMatcher("command", _command), 
                new ArgumentAwareResponseFiller<T>(_action)));
        }
    }

    public class ActionConfig
    {
        private readonly string _command;
        private readonly RouteConfig _parent;
        private readonly JavaScriptSerializer _javaScriptSerializer;

        public ActionConfig(string command, RouteConfig parent, JavaScriptSerializer javaScriptSerializer)
        {
            _command = command;
            _parent = parent;
            _javaScriptSerializer = javaScriptSerializer;
        }

        public RouteConfig Do<TInput>(Func<TInput, IResponseFiller> action) where TInput : new()
        {
            return new ActionRouteConfig<TInput>(_parent, _command, action);
        }

        public RouteConfig DoCommand<TInput>(ICommand<TInput> command) where TInput : new()
        {
            return new ActionRouteConfig<TInput>(_parent, _command, input => new JsonResponseFiller(command.Execute(input), _javaScriptSerializer));
        }
    }
}