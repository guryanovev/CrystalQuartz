namespace CrystalQuartz.WebFramework
{
    using System;
    using System.Threading.Tasks;
    using CrystalQuartz.WebFramework.HttpAbstractions;
    using CrystalQuartz.WebFramework.Request;

    public class RunningApplication
    {
        private readonly IRequestHandler[] _handlers;
        private readonly Action<Exception> _errorAction;

        public RunningApplication(IRequestHandler[] handlers, Action<Exception> errorAction)
        {
            _handlers = handlers;
            _errorAction = errorAction;
        }

        public async Task Handle(IRequest request, IResponseRenderer renderer)
        {
            try
            {
                foreach (IRequestHandler handler in _handlers)
                {
                    RequestHandlingResult result = handler.HandleRequest(request);
                    if (result.IsHandled)
                    {
                        await renderer.Render(result.Response);
                        return;
                    }
                }
            }
            catch (Exception ex)
            {
                _errorAction?.Invoke(ex);
                throw;
            }
        }
    }
}