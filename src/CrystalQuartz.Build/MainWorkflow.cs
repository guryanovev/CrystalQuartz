using System.Collections.Generic;
using System.Reflection;
using Rosalia.TaskLib.AssemblyInfo;
using Rosalia.TaskLib.Standard.Tasks;

namespace CrystalQuartz.Build
{
    using System;
    using Extensions;
    using Rosalia.Core;
    using Rosalia.Core.FileSystem;
    using Rosalia.TaskLib.MsBuild;
    using Rosalia.TaskLib.NuGet.Tasks;

    public class MainWorkflow : GenericWorkflow<Context>
    {
        public override void RegisterTasks()
        {
            //// ----------------------------------------------------------------------------------------------------------------------------
            Register(
                name: "Init the workflow",
                task: () =>
                {
                    var currentDirectory = Context.WorkDirectory;
                    while (currentDirectory != null && (!currentDirectory.Name.Equals("Src", StringComparison.InvariantCultureIgnoreCase)))
                    {
                        currentDirectory = currentDirectory.Parent;
                    }

                    if (currentDirectory == null)
                    {
                        throw new Exception("Could not find Src directory");
                    }

                    Data.Root = currentDirectory.Parent;
                    Data.Artifacts.EnsureExists();
                    Data.Version = "3.1.0.0";
                });

            //// ----------------------------------------------------------------------------------------------------------------------------
            Register(
                name: "Generate common assembly info",
                task: new GenerateAssemblyInfo()
                    .WithAttribute(_ => new AssemblyProductAttribute("CrystalQuartz"))
                    .WithAttribute(_ => new AssemblyVersionAttribute(Data.Version))
                    .WithAttribute(_ => new AssemblyFileVersionAttribute(Data.Version)),
                beforeExecute:
                    task => task.ToFile(Data.Root.GetDirectory("Src").GetFile("CommonAssemblyInfo.cs")));

            //// ----------------------------------------------------------------------------------------------------------------------------
            Register(
                name: "Compile TypescriptFiles",
                task: new ExecTask(),
                beforeExecute: task =>
                {
                    IDirectory webProjectDirectory = Data
                        .Root
                        .GetDirectory("src")
                        .GetDirectory("CrystalQuartz.Web");

                    IDirectory clientScriptsSourceDirectory = webProjectDirectory
                        .GetDirectory("Client")
                        .GetDirectory("Scripts");

                    IDirectory clientScriptsTargetDirectory = webProjectDirectory
                        .GetDirectory("Content")
                        .GetDirectory("Scripts");

                    task.ToolPath = "tsc";
                    task.Arguments = clientScriptsSourceDirectory.GetFile("Application.ts").AbsolutePath + " -out " +
                                     clientScriptsTargetDirectory.GetFile("application.js").AbsolutePath;
                });

            //// ----------------------------------------------------------------------------------------------------------------------------
            Register(
                name: "Transform intex.html template",
                task: new ExecTask(),
                beforeExecute: task =>
                {
                    task.ToolPath = GetTransformExePath().AbsolutePath;
                    task.Arguments = Data
                        .Root
                        .GetDirectory("src")
                        .GetDirectory("CrystalQuartz.Web/Content")
                        .GetFile("index.tt").AbsolutePath;
                });
            
            //// ----------------------------------------------------------------------------------------------------------------------------
            Register(
                name: "Build solution",
                task: new MsBuildTask());
            
            //// ----------------------------------------------------------------------------------------------------------------------------
            Register(
                name: "Clean artifacts",
                task: () => Data.Artifacts.Files.IncludeByExtension("nupkg", "nuspec").DeleteAll());

            //// ----------------------------------------------------------------------------------------------------------------------------
            Register(
                name: "Generate simple package spec",
                task: new GenerateNuGetSpecTask(),
                beforeExecute: task => task
                    .Id("CrystalQuartz.Simple")
                    .FillCommonProperties(Data)
                    .Description("Installs CrystalQuartz panel (pluggable Qurtz.NET viewer) using simple scheduler provider. This approach is appropriate for scenarios where the scheduler and a web application works in the same AppDomain.")
                    .WithFiles(Data.BuildAssets.GetDirectory("Simple").Files, "content")
                    .ToFile(Data.Artifacts.GetFile("CrystalQuartz.Simple.nuspec")));

            //// ----------------------------------------------------------------------------------------------------------------------------
            Register(
                name: "Generate remote package spec",
                task: new GenerateNuGetSpecTask(),
                beforeExecute: task => task
                    .Id("CrystalQuartz.Remote")
                    .FillCommonProperties(Data)
                    .Description("Installs CrystalQuartz panel (pluggable Qurtz.NET viewer) using remote scheduler provider. Note that you should set remote scheduler URI after the installation.")
                    .WithFiles(Data.BuildAssets.GetDirectory("Remote").Files, "content")
                    .ToFile(Data.Artifacts.GetFile("CrystalQuartz.Remote.nuspec")));
            
            //// ----------------------------------------------------------------------------------------------------------------------------
            Register(
                name: "Build packages",
                task: ForEach(
                    () => Data.Artifacts.Files.IncludeByExtension(".nuspec"),
                    file => Register(
                        name: string.Format("Generate NuGet package for {0}", file.NameWithoutExtension),
                        task: new GeneratePackageTask
                        {
                            SpecFile = file,
                            WorkDirectory = Data.Artifacts,
                            ToolPath = Data.Root.GetDirectory("src").GetDirectory(".nuget").GetFile("NuGet.exe").AbsolutePath
                        })));
        }

        private IEnumerable<IDirectory> GetTratsformExePossibleLocations()
        {
            var vsVersion = Context.Environment.GetVariable("VisualStudioVersion");
            var commonProgramFiles =
                Context.Environment.GetVariable("COMMONPROGRAMFILES(x86)") ??
                Context.Environment.GetVariable("COMMONPROGRAMFILES");
                
            var commonProgramFilesDirectory = new DefaultDirectory(commonProgramFiles);

            if (!string.IsNullOrEmpty(vsVersion))
            {
                yield return
                commonProgramFilesDirectory.GetDirectory(
                    @"Microsoft Shared\TextTemplating\").GetDirectory(vsVersion);
            }

            var versions = new[] { "10.0", "11.0", "12.0", "13.0", "14.0" };
            foreach (var version in versions)
            {
                commonProgramFilesDirectory.GetDirectory(
                    @"Microsoft Shared\TextTemplating").GetDirectory(version);
            }
        }

        private IFile GetTransformExePath()
        {
            foreach (var directory in GetTratsformExePossibleLocations())
            {
                if (directory.Exists)
                {
                    var resultFile = directory.GetFile("TextTransform.exe");
                    if (resultFile.Exists)
                    {
                        return resultFile;
                    }
                }
            }

            throw new Exception("Could not find TextTransform.exe utility");
        }
    }
}