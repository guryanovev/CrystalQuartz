namespace CrystalQuartz.Build.Tasks
{
    using CrystalQuartz.Build.Common;
    using Rosalia.Core.Api;
    using Rosalia.Core.Tasks;
    using Rosalia.Core.Tasks.Results;
    using Rosalia.TaskLib.Standard.Tasks;

    public class CompileClientAssets : Subflow
    {
        private readonly SolutionStructure _solution;

        public CompileClientAssets(SolutionStructure solution)
        {
            _solution = solution;
        }

        protected override bool IsSequence
        {
            get { return true; }
        }

        protected override void RegisterTasks()
        {
            Task(
                "initClientProject",
                c => CreateNpmTask(c, "install")
                    //.WithPrecondition(() => !(_solution.CrystalQuartz_Application_Client/"node_modules").AsDirectory().Exists)
                    );

            Task(
                "clientReleaseBuild",
                c => CreateNpmTask(c, "run build-release"));

            Task(
                "clientDemoBuild",
                c => CreateNpmTask(c, "run build-demo"));
        }

        private ITask<Nothing> CreateNpmTask(TaskContext context, string command)
        {
            var commandFields = context.Environment.IsMono
                ? new
                {
                    ToolPath = "npm",
                    Arguments = command
                } : 
                new 
                {
                    ToolPath = "cmd.exe",
                    Arguments = "/c npm.cmd " + command
                };

            return new ExecTask
            {
                ToolPath = commandFields.ToolPath,
                Arguments = commandFields.Arguments,
                WorkDirectory = _solution.CrystalQuartz_Application_Client
            };
        }
    }
}