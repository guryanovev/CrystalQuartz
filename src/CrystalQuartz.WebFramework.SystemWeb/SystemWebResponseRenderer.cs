namespace CrystalQuartz.WebFramework.SystemWeb
{
    using System.Threading.Tasks;
    using System.Web;
    using CrystalQuartz.WebFramework.HttpAbstractions;

    public class SystemWebResponseRenderer : IResponseRenderer
    {
        private readonly HttpContext _context;

        public SystemWebResponseRenderer(HttpContext context)
        {
            _context = context;
        }

        public async Task Render(Response response)
        {
            _context.Response.StatusCode = response.StatusCode;
            _context.Response.ContentType = response.ContentType;

            if (response.ContentFiller != null)
            {
                await response.ContentFiller.Invoke(_context.Response.OutputStream);
            }
        }
    }
}