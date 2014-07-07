using System;
using System.Collections.Generic;
using CrystalQuartz.WebFramework.Commands;
using CrystalQuartz.WebFramework.Request;
using CrystalQuartz.WebFramework.Response;
using CrystalQuartz.WebFramework.Routing;

namespace CrystalQuartz.WebFramework
{
    public abstract class Application : EmptyRouteConfig
    {
        public abstract RouteConfig Config { get; }

        protected IResponseFiller Json(object model)
        {
            return new JsonResponseFiller(model);
        }

        protected IResponseFiller View(object model)
        {
            return null;
        }
    }

    public abstract class RouteConfig
    {
        public ActionConfig When(string urlPattern)
        {
            return new ActionConfig(urlPattern, this);
        }

        public abstract IList<IRequestHandler> CreateHandlers();
    }

    public class EmptyRouteConfig : RouteConfig
    {
        public override IList<IRequestHandler> CreateHandlers()
        {
            return new List<IRequestHandler>();
        }
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

        public ActionConfig(string command, RouteConfig parent)
        {
            _command = command;
            _parent = parent;
        }

        public RouteConfig Do<TInput>(Func<TInput, IResponseFiller> action) where TInput : new()
        {
            return new ActionRouteConfig<TInput>(_parent, _command, action);
        }

        public RouteConfig DoCommand<TInput>(ICommand<TInput> command) where TInput : new()
        {
            return new ActionRouteConfig<TInput>(_parent, _command, input => new JsonResponseFiller(command.Execute(input)));
        }
    }
}