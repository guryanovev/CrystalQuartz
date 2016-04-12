using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(CrystalQuartz.Web.DemoOwin.Startup))]
namespace CrystalQuartz.Web.DemoOwin
{
    using CrystalQuartz.Owin;

    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);

            app.Use(typeof (CrystalQuartzPanelMiddleware), new FakeProvider());
        }
    }
}
