using CrystalQuartz.Build.Extensions;
using Rosalia.Core.FileSystem;

namespace CrystalQuartz.Build
{
    using System;
    using Rosalia.Core;
    using Rosalia.TaskLib.MsBuild;
    using Rosalia.TaskLib.NuGet.Tasks;

    public class MainWorkflow : GenericWorkflow<Context>
    {
        public override void RegisterTasks()
        {
            Register(name: "Initialize context",
                    task: () =>
                    {
                        Data.Version = "2.0.2.0";
                        Data.Configuration = "Debug";
                        Data.ProjectRootDirectory = GetSolutionDirectory(Context.WorkDirectory);
                        Data.Src = Data.ProjectRootDirectory.GetDirectory("Src");
                        Data.NugetExe = Data.Src.GetDirectory(".nuget").GetFile("nuget.exe");
                        Data.SolutionFile = Data.Src.GetFile("CrystalQuartz.sln");
                        Data.Artifacts = Data.ProjectRootDirectory.GetDirectory("Artifacts");
                    });

            Register(
                    name: "Build solution",
                    task: new MsBuildTask(),
                    beforeExecute: task => task
                        .WithProjectFile(Data.SolutionFile)
                        .WithConfiguration(Data.Configuration)
                        .WithVerbosityMinimal()
                    );

            Register(
                    name: "Clean artifacts",
                    task: () => Context.WorkDirectory.Files.IncludeByExtension("nupkg", "nuspec").DeleteAll());

            Register(
                name: "Generate simple package spec",
                task: new GenerateNuGetSpecTask(),
                beforeExecute: task => task
                    .Id("CrystalQuartz.Simple-fh")
                    .FillCommonProperties(Data)
                    .Description("Installs CrystalQuartz panel (pluggable Qurtz.NET viewer) using simple scheduler provider. " +
                                 "This approach is appropriate for scenarios where the scheduler and a web application works in the same AppDomain.")
                    .WithFiles(Data.BuildAssets.GetDirectory("Simple").Files, "content")
                    .ToFile(Data.Artifacts.GetFile("CrystalQuartz.Simple.nuspec")));

            Register(
                name: "Generate remote package spec",
                task: new GenerateNuGetSpecTask(),
                beforeExecute: task => task
                    .Id("CrystalQuartz.Remote-fh")
                    .FillCommonProperties(Data)
                    .Description("Installs CrystalQuartz panel (pluggable Qurtz.NET viewer) using remote scheduler provider. Note that you should set remote scheduler URI after the installation.")
                    .WithFiles(Data.BuildAssets.GetDirectory("Remote").Files, "content")
                    .ToFile(Data.Artifacts.GetFile("CrystalQuartz.Remote.nuspec")));

            Register(
                name: "Generate NuGet packages",
                task: ForEach(
                    () => Data.Artifacts.Files.IncludeByExtension(".nuspec"),
                    file => Register(
                        name: "Generate nuget package " + file.Name,
                        task: new GeneratePackageTask
                        {
                            ToolPath = Data.NugetExe.AbsolutePath,
                            SpecFile = file
                        })));
        }

        private static IDirectory GetSolutionDirectory(IDirectory workingDirectory)
        {
            var currentDirectory = workingDirectory;
            while(currentDirectory != null
                   && (!currentDirectory.Name.Equals("Src", StringComparison.InvariantCultureIgnoreCase)))
            {
                currentDirectory = currentDirectory.Parent;
            }

            if(currentDirectory == null)
            {
                throw new Exception("Could not find Src directory");
            }

            return currentDirectory.Parent;
        }
    }
}