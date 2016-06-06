using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(CrystalQuartz.Samples.OwinRemote.Startup))]
namespace CrystalQuartz.Samples.OwinRemote
{
    using CrystalQuartz.Core.SchedulerProviders;
    using CrystalQuartz.Owin;

    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.UseCrystalQuartz(new RemoteSchedulerProvider
            {
                SchedulerHost = "tcp://localhost:555/QuartzScheduler"
            });
        }
    }
}
