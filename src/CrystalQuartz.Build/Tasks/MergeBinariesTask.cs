using System.IO;
using Rosalia.Core.Logging;

namespace CrystalQuartz.Build.Tasks
{
    using System.Linq;
    using CrystalQuartz.Build.Common;
    using Rosalia.Core.Api;
    using Rosalia.Core.Tasks;
    using Rosalia.Core.Tasks.Results;
    using Rosalia.FileSystem;
    using Rosalia.TaskLib.Standard.Tasks;

    public class MergeBinariesTask : Subflow
    {
        private readonly string[] _webAssemblies400 = 
        {
            /*
             * Please note that because of bacward campatibility
             * the CrystalQuartz.Core.dll could not be merged here
             * and should be included to the NuGet package as 
             * a separate assembly.
             */
            "CrystalQuartz.Core.Quartz2.dll",
            "CrystalQuartz.WebFramework.dll",
            "CrystalQuartz.Application.dll",
            "CrystalQuartz.Web.dll",
            "CrystalQuartz.WebFramework.SystemWeb.dll"
        };

        private readonly string[] _webAssemblies452 = 
        {
            "CrystalQuartz.Core.Quartz2.dll",
            "CrystalQuartz.Core.Quartz3.dll",
            "CrystalQuartz.WebFramework.dll",
            "CrystalQuartz.Application.dll",
            "CrystalQuartz.Web.dll",
            "CrystalQuartz.WebFramework.SystemWeb.dll"
        };

        private readonly string[] _owinAssemblies450 = 
        {
            "CrystalQuartz.Owin.dll",
            "CrystalQuartz.Core.dll",
            "CrystalQuartz.Core.Quartz2.dll",
            "CrystalQuartz.Application.dll",
            "CrystalQuartz.WebFramework.dll",
            "CrystalQuartz.WebFramework.Owin.dll"
        };

        private readonly string[] _owinAssemblies452 = 
        {
            "CrystalQuartz.Owin.dll",
            "CrystalQuartz.Core.dll",
            "CrystalQuartz.Core.Quartz2.dll",
            "CrystalQuartz.Core.Quartz3.dll",
            "CrystalQuartz.WebFramework.dll",
            "CrystalQuartz.Application.dll",
            "CrystalQuartz.WebFramework.Owin.dll"
        };

        private readonly string[] _netStandardAssemblies20 = 
        {
            "CrystalQuartz.AspNetCore.dll",
            "CrystalQuartz.Core.dll",
            "CrystalQuartz.Core.Quartz2.dll",
            "CrystalQuartz.Core.Quartz3.dll",
            "CrystalQuartz.WebFramework.dll",
            "CrystalQuartz.Application.dll"
        };

        private readonly string[] _dotNetCoreLibsCandidates =
        {
            "/usr/local/share/dotnet/sdk/NuGetFallbackFolder/microsoft.netcore.app/2.0.0/ref/netcoreapp2.0",
            "/usr/local/share/dotnet/sdk/NuGetFallbackFolder/microsoft.netcore.app/2.0.7/ref/netcoreapp2.0",
            "/usr/local/share/dotnet/shared/Microsoft.NETCore.App/2.0.0",
            "/usr/local/share/dotnet/shared/Microsoft.NETCore.App/2.0.7",
            "/usr/local/share/dotnet/sdk/NuGetFallbackFolder/netstandard.library/2.0.0/build/netstandard2.0/ref",
            "/usr/local/share/dotnet/sdk/NuGetFallbackFolder/netstandard.library/2.0.7/build/netstandard2.0/ref",
            "/usr/share/dotnet/sdk/NuGetFallbackFolder/microsoft.netcore.app/2.0.0/ref/netcoreapp2.0",
            "/usr/share/dotnet/sdk/NuGetFallbackFolder/microsoft.netcore.app/2.0.7/ref/netcoreapp2.0",
            "/usr/share/dotnet/shared/Microsoft.NETCore.App/2.0.0",
            "/usr/share/dotnet/shared/Microsoft.NETCore.App/2.0.7",
            "/usr/share/dotnet/sdk/NuGetFallbackFolder/netstandard.library/2.0.0/build/netstandard2.0/ref",
            "/usr/share/dotnet/sdk/NuGetFallbackFolder/netstandard.library/2.0.7/build/netstandard2.0/ref",
        };

        private readonly SolutionStructure _solution;
        private readonly string _configuration;

        public MergeBinariesTask(SolutionStructure solution, string configuration)
        {
            _solution = solution;
            _configuration = configuration;
        }

        protected override bool IsSequence
        {
            get { return true; }
        }

        protected override void RegisterTasks()
        {
            Task(
                "MergeSystemWeb400",
                CreateMergeTask("CrystalQuartz.Web.dll", _webAssemblies400, "400"));

            Task(
                "MergeSystemWeb452",
                CreateMergeTask("CrystalQuartz.Web.dll", _webAssemblies452, "452"));

            Task(
                "MergeOwin450",
                CreateMergeTask("CrystalQuartz.Owin.dll", _owinAssemblies450, "450"));

            Task(
                "MergeOwin452",
                CreateMergeTask("CrystalQuartz.Owin.dll", _owinAssemblies452, "452"));

            var resolveCoreLibs = Task(
                "resolve Core Libs",
                context =>
                {
                    context.Log.Info("Discovering core libs directories");

                    return _dotNetCoreLibsCandidates
                        .Select(path =>
                        {
                            bool exists = new DefaultDirectory(path).Exists;

                            context.Log.AddMessage(exists ? MessageLevel.Success : MessageLevel.Warn,  "Checking [" + path + "]: " + (exists ? "found" : "not found"));

                            return new
                            {
                                Found = exists,
                                Path = path
                            };
                        })
                        .Where(x => x.Found)
                        .Select(x => x.Path)
                        .ToArray()
                        .AsTaskResult();
                });

            Task(
                "MergeNetStandard20",
                from libs in resolveCoreLibs
                select CreateMergeTask(
                    "CrystalQuartz.AspNetCore.dll", 
                    _netStandardAssemblies20.Select(x => Path.Combine("netstandard2.0", x)).ToArray(), 
                    "netstandard2.0",
                    libs));
        }

        private ITask<Nothing> CreateMergeTask(string outputDllName, string[] inputAssembliesNames, string dotNetVersionAlias, string[] libs = null)
        {
            IDirectory ilMergePackage = (_solution.Src/"packages").AsDirectory().Directories.Last(d => d.Name.StartsWith("ILRepack"));

            IDirectory bin = _solution.Artifacts / ("bin_" + dotNetVersionAlias);

            return new ExecTask
            {
                ToolPath = ilMergePackage/"tools"/"ILRepack.exe",

                Arguments = string.Format(
                    "{0}/out:{1} {2}",
                    libs == null || libs.Length == 0 ? string.Empty : (string.Join(" ", libs.Select(x => "/lib:" + x)) + " "),
                    bin/(_configuration + "_Merged")/outputDllName,
                    string.Join(" ",
                        inputAssembliesNames.Select(dll => (bin/_configuration/dll).AsFile().AbsolutePath)))
            };
        }
    }
}