namespace CrystalQuartz.WebFramework.Owin
{
    using CrystalQuartz.WebFramework.HttpAbstractions;
    using Microsoft.Owin;

    public class OwinResponseRenderer : IResponseRenderer
    {
        private readonly IOwinContext _context;

        public OwinResponseRenderer(IOwinContext context)
        {
            _context = context;
        }

        public void Render(Response response)
        {
            _context.Response.StatusCode = response.StatusCode;
            _context.Response.ContentType = response.ContentType;
            if (response.ContentFiller != null)
            {
                response.ContentFiller.Invoke(_context.Response.Body);
            }
        }
    }
}