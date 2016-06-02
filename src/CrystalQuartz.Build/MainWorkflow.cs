namespace CrystalQuartz.Build
{
    using System;
    using System.Linq;
    using System.Reflection;
    using CrystalQuartz.Build.Common;
    using CrystalQuartz.Build.Extensions;
    using CrystalQuartz.Build.Tasks;
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
                        throw new Exception("Could not find Src directory " + WorkDirectory);
                    }

                    IDirectory artifacts = currentDirectory.Parent/"Artifacts";
                    artifacts.EnsureExists();
                    artifacts.Files.IncludeByExtension("nupkg", "nuspec").DeleteAll();

                    IDirectory mergedBin = currentDirectory.Parent/"bin"/"Merged";
                    mergedBin.EnsureExists();

                    return new
                    {
                        //Root = currentDirectory.Parent,
                        //Artifacts = artifacts,
                        Version = "4.0.0.0",
                        //Src = currentDirectory,
                        Configuration = "Debug",
                        //BuildAssets = (currentDirectory/"CrystalQuartz.Build"/"Assets").AsDirectory()
                        Solution = new SolutionStructure(currentDirectory.Parent)
                    }.AsTaskResult();
                });

            //// ----------------------------------------------------------------------------------------------------------------------------
            var generateCommonAssemblyInfo = Task(
                "Generate common assembly info",
                from data in initTask 
                select new GenerateAssemblyInfo(data.Solution.Src/"CommonAssemblyInfo.cs")
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
                        (data.Solution.CrystalQuartz_Application/"Client"/"Scripts"/"Application.ts").AsFile().GetRelativePath(WorkDirectory) + " -out " +
                        (data.Solution.CrystalQuartz_Application/"Content"/"Scripts"/"application.js").AsFile().GetRelativePath(WorkDirectory)
                });

            //// ----------------------------------------------------------------------------------------------------------------------------
            var transformIndexHtml = Task(
                "Transform intex.html template",
                from data in initTask
                select new ExecTask
                {
                    ToolPath = (data.Solution.Src/"packages").AsDirectory().Directories.Last(dir => dir.Name.StartsWith("Mono.TextTransform"))/"tools"/"TextTransform.exe",
                    Arguments = data.Solution.CrystalQuartz_Application/"Content"/"index.tt"
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
                select _ => data.Solution.Artifacts.Files.IncludeByExtension("nupkg", "nuspec").DeleteAll());

            var mergeBinaries = Task(
                "MergeBinaries",

                from data in initTask
                select new MergeBinariesTask(data.Solution, data.Configuration).AsSubflow(),
                
                DependsOn(buildSolution));


            var generateNuspecs = Task(
                "GenerateNuspecs",
                from data in initTask
                select new GenerateNuspecsTask(data.Solution, data.Configuration, data.Version),
                
                DependsOn(mergeBinaries));

//            //// ----------------------------------------------------------------------------------------------------------------------------
//            var generateSimplePackageNuspec = Task(
//                "Generate simple package spec",
//                from data in initTask
//                select new GenerateNuGetSpecTask(data.Artifacts/"CrystalQuartz.Simple.nuspec")
//                    .Id("CrystalQuartz.Simple")
//                    .FillCommonProperties(data.Root/"bin"/data.Configuration, data.Version)
//                    .Description("Installs CrystalQuartz panel (pluggable Qurtz.NET viewer) using simple scheduler provider. This approach is appropriate for scenarios where the scheduler and a web application works in the same AppDomain.")
//                    .WithFiles((data.BuildAssets/"Simple").AsDirectory().Files, "content"),
//
//                DependsOn(mergeBinaries), // todo move out of here
//                DependsOn(cleanArtifacts),
//                DependsOn(buildSolution));
//
//            //// ----------------------------------------------------------------------------------------------------------------------------
//            var generateRemotePackageNuspec = Task(
//                "Generate remote package spec",
//                from data in initTask
//                select new GenerateNuGetSpecTask(data.Artifacts/"CrystalQuartz.Remote.nuspec")
//                    .Id("CrystalQuartz.Remote")
//                    .FillCommonProperties(data.Root/"bin"/data.Configuration, data.Version)
//                    .Description("Installs CrystalQuartz panel (pluggable Qurtz.NET viewer) using remote scheduler provider. Note that you should set remote scheduler URI after the installation.")
//                    .WithFiles(data.BuildAssets.GetDirectory("Remote").Files, "content"),
//                        
//                DependsOn(generateSimplePackageNuspec));
            
            //// ----------------------------------------------------------------------------------------------------------------------------
            
            var buildPackages = Task(
                "Build packages",
                from data in initTask
                select ForEach(data.Solution.Artifacts.Files.IncludeByExtension(".nuspec")).Do(
                    nuspec => new GeneratePackageTask(nuspec)
                    {
                        WorkDirectory = data.Solution.Artifacts,
                        ToolPath = data.Solution.Src/".nuget"/"NuGet.exe"
                    }, 
                    nuspec => string.Format("Generate NuGet package for {0}", nuspec.NameWithoutExtension)),
                    
                Default(),
                DependsOn(generateNuspecs));

            //// ----------------------------------------------------------------------------------------------------------------------------

            Task(
                "PushPackages",

                from data in initTask
                select
                    ForEach(data.Solution.Artifacts.Files.IncludeByExtension("nupkg")).Do(
                        package => new PushPackageTask(package)
                        {
                            WorkDirectory = data.Solution.Artifacts,
                            ToolPath = data.Solution.Src/".nuget"/"NuGet.exe"
                        },
                        package => "Push" + package.NameWithoutExtension),

                DependsOn(buildPackages));
        }
    }
}
