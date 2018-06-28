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
        private readonly string _version;

        public CompileClientAssets(SolutionStructure solution, string version)
        {
            _solution = solution;
            _version = version;
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
                c => CreateNpmTask(c, "run build-demo -- --env.v=" + _version));
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