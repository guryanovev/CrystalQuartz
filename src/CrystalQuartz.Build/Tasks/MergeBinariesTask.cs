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
        private readonly string[] _webAssemblies = 
        {
            /*
             * Please note that because of bacward campatibility
             * the CrystalQuartz.Core.dll could not be merged here
             * and should be included to the NuGet package as 
             * a separate assembly.
             */
            "CrystalQuartz.WebFramework.dll",
            "CrystalQuartz.Application.dll",
            "CrystalQuartz.Web.dll",
            "CrystalQuartz.WebFramework.SystemWeb.dll"
        };

        private readonly string[] _owinAssemblies = 
        {
            "CrystalQuartz.Core.dll",
            "CrystalQuartz.WebFramework.dll",
            "CrystalQuartz.Application.dll",
            "CrystalQuartz.Owin.dll",
            "CrystalQuartz.WebFramework.Owin.dll"
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
                "MergeSystemWeb",
                CreateMergeTask("CrystalQuartz.Web.dll", _webAssemblies));

            Task(
                "MergeOwin",
                CreateMergeTask("CrystalQuartz.Owin.dll", _owinAssemblies));
        }

        private ITask<Nothing> CreateMergeTask(string outputDllName, string[] inputAssembliesNames)
        {
            IDirectory ilMergePackage = (_solution.Src/"packages").AsDirectory().Directories.Last(d => d.Name.StartsWith("ILRepack"));

            return new ExecTask
            {
                ToolPath = ilMergePackage/"tools"/"ILRepack.exe",

                Arguments = string.Format(
                    "/out:{0} {1}",
                    _solution.Root/"bin"/"Merged"/outputDllName,
                    string.Join(" ",
                        inputAssembliesNames.Select(dll => (_solution.Root/"bin"/_configuration/dll).AsFile().AbsolutePath)))
            };
        }
    }
}