namespace CrystalQuartz.Web.FrontController
{
    using System.Collections.Generic;
    using System.Text;
    using System.Web;

    /// <summary>
    /// Front-controller-like <code>IHttpHandler</code> implementation.
    /// </summary>
    public abstract class FrontControllerHandler : IHttpHandler
    {
        private readonly IList<IRequestHandler> _processors;

        protected FrontControllerHandler(IList<IRequestHandler> processors)
        {
            _processors = processors;
        }

        public void ProcessRequest(HttpContext context)
        {
            context.Response.ContentEncoding = Encoding.UTF8;

            var contextWrapper = new HttpContextWrapper(context);
            foreach (var processor in _processors)
            {
                if (processor.HandleRequest(contextWrapper))
                {
                    return;
                }
            }

            throw new HttpException(500, "Internal Server Error");
        }

        public virtual bool IsReusable
        {
            get { return false; }
        }
    }
}