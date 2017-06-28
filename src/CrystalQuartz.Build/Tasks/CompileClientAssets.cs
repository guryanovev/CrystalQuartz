namespace CrystalQuartz.Build.Tasks
{
    using CrystalQuartz.Build.Common;
    using Rosalia.Core.Api;
    using Rosalia.TaskLib.Standard.Tasks;

    public class CompileClientAssets : Subflow
    {
        private readonly SolutionStructure _solution;

        public CompileClientAssets(SolutionStructure solution)
        {
            _solution = solution;
        }

        protected override void RegisterTasks()
        {
            var initClientProject = Task(
                "initClientProject",
                new ExecTask
                    {
                        ToolPath = "npm.cmd",
                        Arguments = "install",
                        WorkDirectory = _solution.CrystalQuartz_Application_Client
                    }
                    .WithPrecondition(() => !(_solution.CrystalQuartz_Application_Client/"node_modules").AsDirectory().Exists));

            Task(
                "clientReleaseBuild",
                new ExecTask
                {
                    ToolPath = "npm.cmd",
                    Arguments = "run build-release",
                    WorkDirectory = _solution.CrystalQuartz_Application_Client
                },
                
                DependsOn(initClientProject));
        }
    }
}