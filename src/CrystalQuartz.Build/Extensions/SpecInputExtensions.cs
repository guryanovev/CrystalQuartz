using Rosalia.TaskLib.NuGet.Tasks;

namespace CrystalQuartz.Build.Extensions
{
    using System.Linq;
    using Rosalia.FileSystem;

    public static class SpecInputExtensions
    {
        public static GenerateNuGetSpecTask FillCommonProperties(
            this GenerateNuGetSpecTask input, 
            IDirectory dependenciesProject,
            string version,
            params IFile[] libBinaries)
        {
            return libBinaries.Aggregate(
                input
                    .Version(version)
                    .Authors("Eugene Guryanov")
                    .Owners("Eugene Guryanov")
                    .LicenseUrl("http://dev.perl.org/licenses/")
                    .ProjectUrl("https://github.com/guryanovev/CrystalQuartz")
                    .Tags(".NET", "ASP.NET", "Quartz.NET", "Scheduler", "Job", "Trigger")
                    .WithDependenciesFromPackagesConfig(dependenciesProject, ignoreFrameworkVersion: true),

                (x, file) => x.WithFile(file, "lib"));
        }
    }
}