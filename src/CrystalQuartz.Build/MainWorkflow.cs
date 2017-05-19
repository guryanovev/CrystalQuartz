namespace CrystalQuartz.Build
{
    using System;
    using System.Linq;
    using System.Reflection;
    using CrystalQuartz.Build.Common;
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
                        Version = "4.2.1.0",
                        Configuration = "Debug",
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
                
                DependsOn(cleanArtifacts),
                DependsOn(mergeBinaries));

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
                    
                //Default(),
                DependsOn(generateNuspecs));

            //// ----------------------------------------------------------------------------------------------------------------------------

            Task(
                "DevBuild",
                () => { },
                Default(),
                DependsOn(compileTypescript),
                DependsOn(transformIndexHtml));

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
