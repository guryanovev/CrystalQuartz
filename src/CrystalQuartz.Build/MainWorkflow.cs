namespace CrystalQuartz.Build
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Reflection;
    using CrystalQuartz.Build.Extensions;
    using Rosalia.Core.Api;
    using Rosalia.FileSystem;
    using Rosalia.TaskLib.AssemblyInfo;
    using Rosalia.TaskLib.MsBuild;
    using Rosalia.TaskLib.NuGet.Tasks;
    using Rosalia.TaskLib.Standard.Tasks;

    public class MainWorkflow : Workflow
    {
        protected override void RegisterTasks()
        {
            //// ----------------------------------------------------------------------------------------------------------------------------
            var initTask = Task(
                "Init the workflow",
                _ =>
                {
                    IDirectory currentDirectory = WorkDirectory.Closest(dir => dir.Name.Equals("src", StringComparison.InvariantCultureIgnoreCase));

                    if (currentDirectory == null)
                    {
                        throw new Exception("Could not find Src directory");
                    }

                    IDirectory artifacts = currentDirectory.Parent/"Artifacts";
                    artifacts.EnsureExists();
                    artifacts.Files.IncludeByExtension("nupkg", "nuspec").DeleteAll();

                    return new
                    {
                        Root = currentDirectory.Parent,
                        Artifacts = artifacts,
                        Version = "3.1.0.1",
                        Src = currentDirectory,
                        Configuration = "Debug",
                        BuildAssets = (currentDirectory/"CrystalQuartz.Build"/"Assets").AsDirectory()
                    }.AsTaskResult();
                });

            //// ----------------------------------------------------------------------------------------------------------------------------
            var generateCommonAssemblyInfo = Task(
                "Generate common assembly info",
                from data in initTask 
                select new GenerateAssemblyInfo(data.Src/"CommonAssemblyInfo.cs")
                {
                    Attributes =
                    {
                        _ => new AssemblyProductAttribute("CrystalQuartz"),
                        _ => new AssemblyVersionAttribute(data.Version),
                        _ => new AssemblyFileVersionAttribute(data.Version)
                    }
                });

            //// ----------------------------------------------------------------------------------------------------------------------------
            var compileTypescript = Task(
                "Compile TypescriptFiles",
                from data in initTask
                select new ExecTask
                {
                    ToolPath = "tsc",
                    Arguments =                         
                        (data.Src/"CrystalQuartz.Web"/"Client"/"Scripts"/"Application.ts").AsFile().GetRelativePath(WorkDirectory) + " -out " +
                        (data.Src/"CrystalQuartz.Web"/"Content"/"Scripts"/"application.js").AsFile().GetRelativePath(WorkDirectory)
                });

            //// ----------------------------------------------------------------------------------------------------------------------------
            var transformIndexHtml = Task(
                "Transform intex.html template",
                from data in initTask
                select new ExecTask
                {
                    ToolPath = (data.Src/"packages").AsDirectory().Directories.Last(dir => dir.Name.StartsWith("Mono.TextTransform"))/"tools"/"TextTransform.exe",
                    Arguments = data.Src/"CrystalQuartz.Web/Content"/"index.tt"
                });
            
            //// ----------------------------------------------------------------------------------------------------------------------------
            var buildSolution = Task(
                "Build solution",
                new MsBuildTask(),
                
                DependsOn(generateCommonAssemblyInfo),
                DependsOn(compileTypescript),
                DependsOn(transformIndexHtml));
            
            //// ----------------------------------------------------------------------------------------------------------------------------
            var cleanArtifacts = Task(
                "Clean artifacts",
                from data in initTask
                select _ => data.Artifacts.Files.IncludeByExtension("nupkg", "nuspec").DeleteAll());

            //// ----------------------------------------------------------------------------------------------------------------------------
            var generateSimplePackageNuspec = Task(
                "Generate simple package spec",
                from data in initTask
                select new GenerateNuGetSpecTask(data.Artifacts/"CrystalQuartz.Simple.nuspec")
                    .Id("CrystalQuartz.Simple")
                    .FillCommonProperties(data.Root/"bin"/data.Configuration, data.Version)
                    .Description("Installs CrystalQuartz panel (pluggable Qurtz.NET viewer) using simple scheduler provider. This approach is appropriate for scenarios where the scheduler and a web application works in the same AppDomain.")
                    .WithFiles((data.BuildAssets/"Simple").AsDirectory().Files, "content"),
                    
                DependsOn(cleanArtifacts),
                DependsOn(buildSolution));

            //// ----------------------------------------------------------------------------------------------------------------------------
            var generateRemotePackageNuspec = Task(
                "Generate remote package spec",
                from data in initTask
                select new GenerateNuGetSpecTask(data.Artifacts/"CrystalQuartz.Remote.nuspec")
                    .Id("CrystalQuartz.Remote")
                    .FillCommonProperties(data.Root/"bin"/data.Configuration, data.Version)
                    .Description("Installs CrystalQuartz panel (pluggable Qurtz.NET viewer) using remote scheduler provider. Note that you should set remote scheduler URI after the installation.")
                    .WithFiles(data.BuildAssets.GetDirectory("Remote").Files, "content"),
                        
                DependsOn(generateSimplePackageNuspec));
            
            //// ----------------------------------------------------------------------------------------------------------------------------
            var buildPackages = Task(
                "Build packages",
                from data in initTask
                select ForEach(data.Artifacts.Files.IncludeByExtension(".nuspec")).Do(
                    nuspec => new GeneratePackageTask(nuspec)
                    {
                        WorkDirectory = data.Artifacts,
                        ToolPath = data.Src/".nuget"/"NuGet.exe"
                    }, 
                    nuspec => string.Format("Generate NuGet package for {0}", nuspec.NameWithoutExtension)),
                    
                Default(),
                DependsOn(generateRemotePackageNuspec),
                DependsOn(generateSimplePackageNuspec));

            //// ----------------------------------------------------------------------------------------------------------------------------

            Task(
                "PushPackages",

                from data in initTask
                select
                    ForEach(data.Artifacts.Files.IncludeByExtension("nupkg")).Do(
                        package => new PushPackageTask(package)
                        {
                            WorkDirectory = data.Artifacts,
                            ToolPath = data.Src/".nuget"/"NuGet.exe"
                        },
                        package => "Push" + package.NameWithoutExtension),

                DependsOn(buildPackages));
        }
    }
}
