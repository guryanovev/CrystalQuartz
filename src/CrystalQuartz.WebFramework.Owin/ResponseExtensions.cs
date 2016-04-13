namespace CrystalQuartz.WebFramework.Owin
{
    using CrystalQuartz.WebFramework.HttpAbstractions;
    using Microsoft.Owin;

    public static class ResponseExtensions
    {
        public static void RenderTo(this Response response, IOwinContext context)
        {
            context.Response.StatusCode = response.StatusCode;
            context.Response.ContentType = response.ContentType;
            if (result.Response.ContentFiller != null)
            {
                result.Response.ContentFiller.Invoke(context.Response.Body);
            }

        }
    }
}