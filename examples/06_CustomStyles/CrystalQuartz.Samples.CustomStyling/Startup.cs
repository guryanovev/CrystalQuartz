using CrystalQuartz.Samples.CustomStyling;
using Microsoft.Owin;

[assembly: OwinStartup(typeof(Startup))]
namespace CrystalQuartz.Samples.CustomStyling
{
    using Owin;

    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
        }
    }
}
