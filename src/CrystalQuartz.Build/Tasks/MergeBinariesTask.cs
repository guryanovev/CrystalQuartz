using System.IO;

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

            Task(
                "MergeNetStandard20",
                CreateMergeTask(
                    "CrystalQuartz.AspNetCore.dll", 
                    _netStandardAssemblies20.Select(x => Path.Combine("netstandard2.0", x)).ToArray(), 
                    "netstandard2.0"));
        }

        private ITask<Nothing> CreateMergeTask(string outputDllName, string[] inputAssembliesNames, string dotNetVersionAlias)
        {
            IDirectory ilMergePackage = (_solution.Src/"packages").AsDirectory().Directories.Last(d => d.Name.StartsWith("ILRepack"));

            IDirectory bin = _solution.Artifacts / ("bin_" + dotNetVersionAlias);

            return new ExecTask
            {
                ToolPath = ilMergePackage/"tools"/"ILRepack.exe",

                Arguments = string.Format(
                    "/lib:/usr/share/dotnet/sdk/NuGetFallbackFolder/microsoft.netcore.app/2.0.0/ref/netcoreapp2.0 /lib:/usr/share/dotnet/shared/Microsoft.NETCore.App/2.0.0 /out:{0} {1}",
                    bin/(_configuration + "_Merged")/outputDllName,
                    string.Join(" ",
                        inputAssembliesNames.Select(dll => (bin/_configuration/dll).AsFile().AbsolutePath)))
            };
        }
    }
}