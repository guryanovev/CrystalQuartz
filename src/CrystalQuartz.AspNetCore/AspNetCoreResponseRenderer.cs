using CrystalQuartz.WebFramework.HttpAbstractions;
using Microsoft.AspNetCore.Http;

namespace CrystalQuartz.AspNetCore
{
    public class AspNetCoreResponseRenderer : IResponseRenderer
    {
        private readonly HttpContext _context;

        public AspNetCoreResponseRenderer(HttpContext context)
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