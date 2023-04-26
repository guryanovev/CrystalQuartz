namespace CrystalQuartz.Build.Tasks
{
    using CrystalQuartz.Build.Common;
    using CrystalQuartz.Build.Extensions;
    using Rosalia.Core.Api;
    using Rosalia.TaskLib.NuGet.Tasks;

    public class GenerateNuspecsTask : Subflow
    {
        private readonly SolutionStructure _solution;
        private readonly string _configuration;
        private readonly string _version;
        private readonly bool _skipCoreProject;

        public GenerateNuspecsTask(SolutionStructure solution, string configuration, string version, bool skipCoreProject)
        {
            _solution = solution;
            _configuration = configuration;
            _version = version;
            _skipCoreProject = skipCoreProject;
        }

        protected override bool IsSequence
        {
            get { return true; }
        }

        protected override void RegisterTasks()
        {
            var merged = _configuration + "_Merged";

            Task(
                "Generate simple package spec",
                new GenerateNuGetSpecTask(_solution.Artifacts / "CrystalQuartz.Simple.nuspec")
                    .Id("CrystalQuartz.Simple")
                    
                    .FillCommonProperties(
                        _solution.Src/"CrystalQuartz.Web", 
                        _version,
                        new TargetedFile(_solution.Artifacts/"bin"/merged/"net40"/"CrystalQuartz.Web.dll", "net40"),
                        new TargetedFile(_solution.Artifacts/"bin"/merged/"net45"/"CrystalQuartz.Web.dll", "net45"),
                        new TargetedFile(_solution.Artifacts/"bin"/merged/"net452"/"CrystalQuartz.Web.dll", "net452"))

                    .Description("Installs CrystalQuartz panel (pluggable Qurtz.NET viewer) using simple scheduler provider. This approach is appropriate for scenarios where the scheduler and a web application works in the same AppDomain.")
                    .WithFiles((_solution.BuildAssets/"Simple").AsDirectory().Files, "content")
                    .WithDependency("Microsoft.Bcl.Async", "1.0", "net40"));
            
            Task(
                "Generate remote package spec",
                new GenerateNuGetSpecTask(_solution.Artifacts/"CrystalQuartz.Remote.nuspec")
                    .Id("CrystalQuartz.Remote")

                    .FillCommonProperties(
                        _solution.Src/"CrystalQuartz.Web",
                        _version,
                        new TargetedFile(_solution.Artifacts/"bin"/merged/"net40"/"CrystalQuartz.Web.dll", "net40"),
                        new TargetedFile(_solution.Artifacts/"bin"/merged/"net45"/"CrystalQuartz.Web.dll", "net45"),
                        new TargetedFile(_solution.Artifacts/"bin"/merged/"net452"/"CrystalQuartz.Web.dll", "net452"))
                    
                    .Description("Installs CrystalQuartz panel (pluggable Qurtz.NET viewer) using remote scheduler provider. Note that you should set remote scheduler URI after the installation.")
                    .WithFiles(_solution.BuildAssets.GetDirectory("Remote").Files, "content")
                    .WithDependency("Microsoft.Bcl.Async", "1.0", "net40"));
            
            Task(
                "Generate Owin package spec",
                new GenerateNuGetSpecTask(_solution.Artifacts/"CrystalQuartz.Owin.nuspec")
                    .Id("CrystalQuartz.Owin")

                    .FillCommonProperties(
                        _solution.Src/"CrystalQuartz.Owin",
                        _version,
                        new TargetedFile(_solution.Artifacts/"bin"/merged/"net45"/"CrystalQuartz.Owin.dll", "net45"),
                        new TargetedFile(_solution.Artifacts/"bin"/merged/"net452"/"CrystalQuartz.Owin.dll", "net452"))
                    
                    .Description("Installs CrystalQuartz panel (pluggable Qurtz.NET viewer) to any application (web or self-hosted) that uses OWIN environment."));
            
            Task(
                "Generate AspNet core package spec",
                new GenerateNuGetSpecTask(_solution.Artifacts/"CrystalQuartz.AspNetCore.nuspec")
                    .Id("CrystalQuartz.AspNetCore")

                    .FillCommonProperties(
                        _solution.Src/"CrystalQuartz.AspNetCore",
                        _version,
                        new TargetedFile(_solution.Artifacts/"bin"/merged/"netstandard2.0"/"CrystalQuartz.AspNetCore.dll", "netstandard2.0"),
                        new TargetedFile(_solution.Artifacts/"bin"/merged/"netstandard2.1"/"CrystalQuartz.AspNetCore.dll", "netstandard2.1"))
                    
                    .Description("Installs CrystalQuartz panel (pluggable Qurtz.NET viewer) to .NET Core or .NET Standard application (web or self-hosted) that uses AspNetCore environment.")
                    .WithDependency("Microsoft.AspNetCore.Http.Abstractions", "2.0.3", "netstandard2.0") // todo: read this dependency automatically
                    .WithDependency("Microsoft.AspNetCore.Http.Abstractions", "2.0.3", "netstandard2.1") // todo: read this dependency automatically
                
                    .WithPrecondition(!_skipCoreProject));
        }
    }
}