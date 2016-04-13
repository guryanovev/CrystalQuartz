namespace CrystalQuartz.WebFramework.SystemWeb
{
    using System.Web;
    using CrystalQuartz.WebFramework.HttpAbstractions;

    public static class ResponseExtensions
    {
        public static void RenderTo(this Response response, HttpContext context)
        {
            context.Response.StatusCode = response.StatusCode;
            context.Response.ContentType = response.ContentType;

            if (response.ContentFiller != null)
            {
                response.ContentFiller.Invoke(context.Response.OutputStream);
            }
        }
    }
}