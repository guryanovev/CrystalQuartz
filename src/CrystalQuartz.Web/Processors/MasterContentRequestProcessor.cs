namespace CrystalQuartz.Web.Processors
{
    using System.Web;
    using FrontController;

    public class MasterContentRequestProcessor : IRequestHandler
    {
        public bool HandleRequest(HttpContextBase context)
        {
            context.Response.Write(string.Format(
@"<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'>

<html xmlns='http://www.w3.org/1999/xhtml'>
    <head>
        <title>{0}</title>
        <link href='CrystalQuartzPanel.axd?file=CrystalQuartz.Web.Content.main.css&type=css' rel='stylesheet' type='text/css' />
        {1}
    </head>
    <body>
        <div id='mainHeader'>
            <a href='/'>&larr; return to the site</a>
            <h1>CrystalQuartz Panel</h1>
        </div>
        <div id='mainContent'>
            {2}
        </div>
    </body>
</html>", GetTitleContent(context), GetHeadContent(context), GetBodyContent(context)));
            return true;
        }

        protected virtual string GetBodyContent(HttpContextBase context)
        {
            return string.Empty;
        }

        protected virtual string GetHeadContent(HttpContextBase context)
        {
            return string.Empty;
        }

        protected virtual string GetTitleContent(HttpContextBase context)
        {
            return string.Empty;
        }
    }
}