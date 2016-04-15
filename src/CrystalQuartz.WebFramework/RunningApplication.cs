namespace CrystalQuartz.WebFramework
{
    using CrystalQuartz.WebFramework.HttpAbstractions;
    using CrystalQuartz.WebFramework.Request;

    public class RunningApplication
    {
        private readonly IRequestHandler[] _handlers;

        public RunningApplication(IRequestHandler[] handlers)
        {
            _handlers = handlers;
        }

        public void Handle(IRequest request, IResponseRenderer renderer)
        {
            foreach (IRequestHandler handler in _handlers)
            {
                RequestHandlingResult result = handler.HandleRequest(request);
                if (result.IsHandled)
                {
                    renderer.Render(result.Response);

                    return;
                }
            }
        }
    }
}