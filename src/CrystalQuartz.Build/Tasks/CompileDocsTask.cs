namespace CrystalQuartz.Build.Tasks
{
    using CrystalQuartz.Build.Common;
    using CrystalQuartz.Build.Helpers;
    using Rosalia.Core.Api;
    using Rosalia.FileSystem;
    using Rosalia.TaskLib.Standard.Tasks;

    public class CompileDocsTask : Subflow
    {
        private readonly SolutionStructure _solution;
        private readonly string _version;

        public CompileDocsTask(SolutionStructure solution, string version)
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
                "initDocsProject",
                c => c.CreateNpmTask(_solution.Docs, "install"));

            Task(
                "buildHexo",
                c => c.CreateNpmTask(_solution.Docs, "run generate"));

            Task(
                "copyDocsArtifacts",
                c =>
                {
                    IDirectory docsArtifacts = _solution.Docs/"public";
                    docsArtifacts.SearchFilesRecursively().CopyRelativelyTo(_solution.Artifacts/"gh-pages");
                });
        }
    }
}