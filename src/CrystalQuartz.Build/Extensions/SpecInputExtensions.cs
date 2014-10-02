using Rosalia.TaskLib.NuGet.Tasks;

namespace CrystalQuartz.Build.Extensions
{
    public static class SpecInputExtensions
    {
        public static GenerateNuGetSpecTask FillCommonProperties(this GenerateNuGetSpecTask input, Context context)
        {
            var webBinDirectory = context.Root.GetDirectory(string.Format("bin\\{0}", context.Configuration));

            return input
                .Version(context.Version)
                .Authors("Eugene Guryanov")
                .Owners("Eugene Guryanov")
                .LicenseUrl("http://dev.perl.org/licenses/")
                .ProjectUrl("https://github.com/guryanovev/CrystalQuartz")
                .Tags(".NET", "ASP.NET", "Quartz.NET", "Scheduler", "Job", "Trigger")
                .WithDependenciesFromPackagesConfig(context.Root.GetDirectory("src\\CrystalQuartz.Web"))
                .WithFile(webBinDirectory.GetFile("CrystalQuartz.Core.dll"), "lib")
                .WithFile(webBinDirectory.GetFile("CrystalQuartz.WebFramework.dll"), "lib")
                .WithFile(webBinDirectory.GetFile("CrystalQuartz.Web.dll"), "lib");
        }
    }
}