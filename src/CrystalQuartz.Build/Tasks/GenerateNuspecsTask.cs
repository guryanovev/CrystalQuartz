namespace CrystalQuartz.Build.Tasks
{
    using CrystalQuartz.Build.Common;
    using CrystalQuartz.Build.Extensions;
    using Rosalia.Core.Api;
    using Rosalia.FileSystem;
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
            var mergedDirName = _configuration + "_Merged";

            IDirectory binDir = _solution.Artifacts/"bin";
            IDirectory mergedDir = binDir/mergedDirName;

            Task(
                "Generate simple package spec",
                new GenerateNuGetSpecTask(_solution.Artifacts / "CrystalQuartz.Simple.nuspec")
                    .Id("CrystalQuartz.Simple")
                    
                    .FillCommonProperties(
                        _solution.Src/"CrystalQuartz.Web", 
                        _version,
                        new TargetedFile(mergedDir/"net40"/"CrystalQuartz.Web.dll", "net40"),
                        new TargetedFile(binDir/_configuration/"net40"/"CrystalQuartz.Core.dll", "net40"),
                        new TargetedFile(mergedDir/"net45"/"CrystalQuartz.Web.dll", "net45"),
                        new TargetedFile(binDir/_configuration/"net45"/"CrystalQuartz.Core.dll", "net45"),
                        new TargetedFile(mergedDir/"net452"/"CrystalQuartz.Web.dll", "net452"),
                        new TargetedFile(binDir/_configuration/"net452"/"CrystalQuartz.Core.dll", "net452"))

                    .Description("Installs CrystalQuartz panel (pluggable Quartz.NET viewer) using simple scheduler provider. This approach is appropriate for scenarios where the scheduler and a web application works in the same AppDomain.")
                    .WithFiles((_solution.BuildAssets/"Simple").AsDirectory().Files, "content")
                    .WithDependency("Microsoft.Bcl.Async", "1.0", "net40"));
            
            Task(
                "Generate remote package spec",
                new GenerateNuGetSpecTask(_solution.Artifacts/"CrystalQuartz.Remote.nuspec")
                    .Id("CrystalQuartz.Remote")

                    .FillCommonProperties(
                        _solution.Src/"CrystalQuartz.Web",
                        _version,
                        new TargetedFile(mergedDir / "net40" / "CrystalQuartz.Web.dll", "net40"),
                        new TargetedFile(binDir / _configuration / "net40" / "CrystalQuartz.Core.dll", "net40"),
                        new TargetedFile(mergedDir / "net45" / "CrystalQuartz.Web.dll", "net45"),
                        new TargetedFile(binDir / _configuration / "net45" / "CrystalQuartz.Core.dll", "net45"),
                        new TargetedFile(mergedDir / "net452" / "CrystalQuartz.Web.dll", "net452"),
                        new TargetedFile(binDir / _configuration / "net452" / "CrystalQuartz.Core.dll", "net452"))
                    
                    .Description("Installs CrystalQuartz panel (pluggable Quartz.NET viewer) using remote scheduler provider. Note that you should set remote scheduler URI after the installation.")
                    .WithFiles(_solution.BuildAssets.GetDirectory("Remote").Files, "content")
                    .WithDependency("Microsoft.Bcl.Async", "1.0", "net40"));
            
            Task(
                "Generate Owin package spec",
                new GenerateNuGetSpecTask(_solution.Artifacts/"CrystalQuartz.Owin.nuspec")
                    .Id("CrystalQuartz.Owin")

                    .FillCommonProperties(
                        _solution.Src/"CrystalQuartz.Owin",
                        _version,
                        new TargetedFile(mergedDir/"net45"/"CrystalQuartz.Owin.dll", "net45"),
                        new TargetedFile(mergedDir/"net452"/"CrystalQuartz.Owin.dll", "net452"))
                    
                    .Description("Installs CrystalQuartz panel (pluggable Quartz.NET viewer) to any application (web or self-hosted) that uses OWIN environment."));
            
            Task(
                "Generate AspNet core package spec",
                new GenerateNuGetSpecTask(_solution.Artifacts/"CrystalQuartz.AspNetCore.nuspec")
                    .Id("CrystalQuartz.AspNetCore")

                    .FillCommonProperties(
                        _solution.Src/"CrystalQuartz.AspNetCore",
                        _version,
                        new TargetedFile(mergedDir/"netstandard2.0"/"CrystalQuartz.AspNetCore.dll", "netstandard2.0"),
                        new TargetedFile(mergedDir/"netstandard2.1"/"CrystalQuartz.AspNetCore.dll", "netstandard2.1"))
                    
                    .Description("Installs CrystalQuartz panel (pluggable Quartz.NET viewer) to .NET Core or .NET Standard application (web or self-hosted) that uses AspNetCore environment.")
                    .WithDependency("Microsoft.AspNetCore.Http.Abstractions", "2.0.3", "netstandard2.0") // todo: read this dependency automatically
                    .WithDependency("Microsoft.AspNetCore.Http.Abstractions", "2.0.3", "netstandard2.1") // todo: read this dependency automatically
                
                    .WithPrecondition(!_skipCoreProject));
        }
    }
}