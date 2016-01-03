using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(CrystalQuartz.Example.CustomStyling.Startup))]
namespace CrystalQuartz.Example.CustomStyling
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
