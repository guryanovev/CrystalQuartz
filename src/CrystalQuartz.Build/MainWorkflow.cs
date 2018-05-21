using Rosalia.Core.Tasks;
using Rosalia.TaskLib.Standard.Tasks;

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

    public class MainWorkflow : Workflow
    {
        protected override void RegisterTasks()
        {
            //// ----------------------------------------------------------------------------------------------------------------------------
            var initTask = Task(
                "Init the workflow",
                context =>
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
                        Version = "6.4.0.0",
                        Configuration = "Release",
                        Solution = new SolutionStructure(currentDirectory.Parent),
                        IsMono = context.Environment.IsMono
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

            var buildClient = Task(
                "BuildClient",
                from data in initTask
                select new CompileClientAssets(data.Solution).AsSubflow());

            //// ----------------------------------------------------------------------------------------------------------------------------

            var restoreNugetPackages = Task(
                "RestoreNugetPackages",
                from data in initTask
                select new ExecTask
                {
                    ToolPath = data.Solution.Src/".nuget"/"NuGet.exe",
                    Arguments = "restore " + (data.Solution.Src/"CrystalQuartz.sln").AsFile().AbsolutePath
                }.AsTask());

            //// ----------------------------------------------------------------------------------------------------------------------------
            
            var buildSolution = Task(
                "Build solution",
                from data in initTask
                select new CustomMsBuildTask
                    {
                        ProjectFile = data.Solution.Src/ "CrystalQuartz.sln",
                        Switches =
                        {
                            MsBuildSwitch.Configuration(data.Configuration)
                        }
                    }
                        
                .AsTask(),
                
                DependsOn(restoreNugetPackages),
                DependsOn(generateCommonAssemblyInfo),
                DependsOn(buildClient));
            
            //// ----------------------------------------------------------------------------------------------------------------------------
            
            var buildCoreSolution = Task(
                "Build Core projects",
                from data in initTask
                select new ExecTask
                    {

                        ToolPath = "dotnet",
                        Arguments = "build " + (data.Solution.Src / "CrystalQuartz.sln") + " --configuration " + data.Configuration
                }
                        
                .AsTask(),
                
                DependsOn(restoreNugetPackages),
                DependsOn(generateCommonAssemblyInfo),
                DependsOn(buildClient));
            
            //// ----------------------------------------------------------------------------------------------------------------------------
            
            var cleanArtifacts = Task(
                "Clean artifacts",
                from data in initTask
                select _ => data.Solution.Artifacts.Files.IncludeByExtension("nupkg", "nuspec").DeleteAll());

            //// ----------------------------------------------------------------------------------------------------------------------------
            
            var mergeBinaries = Task(
                "MergeBinaries",

                from data in initTask
                select new MergeBinariesTask(data.Solution, data.Configuration).AsSubflow(),
                
                DependsOn(buildSolution),
                DependsOn(buildCoreSolution));

            //// ----------------------------------------------------------------------------------------------------------------------------

            var generateNuspecs = Task(
                "GenerateNuspecs",
                from data in initTask
                select new GenerateNuspecsTask(data.Solution, data.Configuration, data.Version + "-beta"),
                
                DependsOn(cleanArtifacts),
                DependsOn(mergeBinaries));

            //// ----------------------------------------------------------------------------------------------------------------------------
            
            var buildPackages = Task(
                "BuildPackages",
                from data in initTask
                select ForEach(data.Solution.Artifacts.Files.IncludeByExtension(".nuspec")).Do(
                    nuspec => new GeneratePackageTask(nuspec)
                    {
                        WorkDirectory = data.Solution.Artifacts,
                        ToolPath = data.Solution.Src/".nuget"/"NuGet.exe"
                    }, 
                    nuspec => string.Format("Generate NuGet package for {0}", nuspec.NameWithoutExtension)),
                    
                DependsOn(generateNuspecs));

            //// ----------------------------------------------------------------------------------------------------------------------------

            Task(
                "DevBuild",
                () => { },

                Default(),
                DependsOn(buildClient),
                DependsOn(buildPackages));

            //// ----------------------------------------------------------------------------------------------------------------------------

            Task(
                "PushPackages",

                from data in initTask
                select
                    ForEach(data.Solution.Artifacts.Files.IncludeByExtension("nupkg")).Do(
                        package => new ExecTask
                        {
                            WorkDirectory = data.Solution.Artifacts,
                            ToolPath = data.Solution.Src/".nuget"/"NuGet.exe",
                            Arguments = "push " + package.AbsolutePath + " -Source https://api.nuget.org/v3/index.json -NonInteractive"
                        },
                        package => "Push" + package.NameWithoutExtension),

                DependsOn(buildPackages));
        }
    }

    internal class CustomMsBuildTask : MsBuildTask
    {
        protected override string GetToolPath(TaskContext context)
        {
            if (context.Environment.IsMono)
            {
                return "msbuild";
            }

            return base.GetToolPath(context);
        }
    }
}
