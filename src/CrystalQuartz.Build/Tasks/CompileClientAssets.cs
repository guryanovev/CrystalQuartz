namespace CrystalQuartz.Build.Tasks
{
    using CrystalQuartz.Build.Common;
    using CrystalQuartz.Build.Helpers;
    using Rosalia.Core.Api;

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
                c => c.CreateNpmTask(_solution.CrystalQuartz_Application_Client, "install")
                    //.WithPrecondition(() => !(_solution.CrystalQuartz_Application_Client/"node_modules").AsDirectory().Exists)
                    );

            Task(
                "clientReleaseBuild",
                c => c.CreateNpmTask(_solution.CrystalQuartz_Application_Client, "run build-release"));

            Task(
                "clientDemoBuild",
                c => c.CreateNpmTask(_solution.CrystalQuartz_Application_Client, "run build-demo -- --env.v=" + _version));
        }
    }
}