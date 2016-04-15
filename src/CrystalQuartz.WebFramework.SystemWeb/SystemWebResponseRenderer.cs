namespace CrystalQuartz.WebFramework.SystemWeb
{
    using System.Web;
    using CrystalQuartz.WebFramework.HttpAbstractions;

    public class SystemWebResponseRenderer : IResponseRenderer
    {
        private readonly HttpContext _context;

        public SystemWebResponseRenderer(HttpContext context)
        {
            _context = context;
        }

        public void Render(Response response)
        {
            _context.Response.StatusCode = response.StatusCode;
            _context.Response.ContentType = response.ContentType;

            if (response.ContentFiller != null)
            {
                response.ContentFiller.Invoke(_context.Response.OutputStream);
            }
        }
    }
}