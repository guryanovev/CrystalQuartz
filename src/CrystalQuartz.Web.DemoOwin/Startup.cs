using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(CrystalQuartz.Web.DemoOwin.Startup))]
namespace CrystalQuartz.Web.DemoOwin
{
    using System.Web.Http;
    using System.Web.Mvc;
    using System.Web.Optimization;
    using System.Web.Routing;
    using CrystalQuartz.Owin;

    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.UseCrystalQuartz(new FakeProvider());

            ConfigureAuth(app);

            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }
    }
}
