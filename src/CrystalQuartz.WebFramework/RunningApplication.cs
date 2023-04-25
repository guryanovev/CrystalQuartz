namespace CrystalQuartz.WebFramework
{
    using System.Threading.Tasks;
    using CrystalQuartz.WebFramework.HttpAbstractions;
    using CrystalQuartz.WebFramework.Request;

    public class RunningApplication
    {
        private readonly IRequestHandler[] _handlers;

        public RunningApplication(IRequestHandler[] handlers)
        {
            _handlers = handlers;
        }

        public async Task Handle(IRequest request, IResponseRenderer renderer)
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
    }
}