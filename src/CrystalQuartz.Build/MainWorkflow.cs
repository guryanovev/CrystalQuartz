using System.Collections.Generic;
using Rosalia.TaskLib.Standard.Input;
using Rosalia.TaskLib.Standard.Tasks;

namespace CrystalQuartz.Build
{
    using System;
    using CrystalQuartz.Build.Extensions;
    using Rosalia.Core;
    using Rosalia.Core.Context;
    using Rosalia.Core.FileSystem;
    using Rosalia.Core.Logging;
    using Rosalia.TaskLib.MsBuild;
    using Rosalia.TaskLib.NuGet.Input;
    using Rosalia.TaskLib.NuGet.Tasks;

    public class MainWorkflow : Workflow<Context>
    {
        private IEnumerable<IDirectory> GetTratsformExePossibleLocations(TaskContext<Context> context)
        {
            var vsVersion = context.Environment.GetVariable("VisualStudioVersion");
            var commonProgramFiles =
                context.Environment.GetVariable("COMMONPROGRAMFILES(x86)") ??
                context.Environment.GetVariable("COMMONPROGRAMFILES");
                
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

        private IFile GetTransformExePath(TaskContext<Context> context)
        {
            foreach (var directory in GetTratsformExePossibleLocations(context))
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

        public override ITask<Context> RootTask
        {
            get
            {
                return Sequence(
                    //// Init
                    Task((builder, context) =>
                    {
                        var currentDirectory = context.WorkDirectory;
                        while (currentDirectory != null && (!currentDirectory.Name.Equals("Src", StringComparison.InvariantCultureIgnoreCase)))
                        {
                            currentDirectory = currentDirectory.Parent;
                        }

                        if (currentDirectory == null)
                        {
                            throw new Exception("Could not find Src directory");
                        }

                        context.Data.Root = currentDirectory.Parent;
                    }),

                    new SimpleExternalToolTask<Context>(context =>
                    {
                        IDirectory webProjectDirectory = context.Data
                            .Root
                            .GetDirectory("src")
                            .GetDirectory("CrystalQuartz.Web");

                        IDirectory clientScriptsSourceDirectory = webProjectDirectory
                            .GetDirectory("Client")
                            .GetDirectory("Scripts");

                        IDirectory clientScriptsTargetDirectory = webProjectDirectory
                            .GetDirectory("Content")
                            .GetDirectory("Scripts");

                        return new ExternalToolInput
                        {
                            ToolPath = "tsc",
                            Arguments = 
                                clientScriptsSourceDirectory.GetFile("Application.ts").AbsolutePath + " -out " +
                                clientScriptsTargetDirectory.GetFile("application.js").AbsolutePath
                        };
                    }),

                    new SimpleExternalToolTask<Context>(context => new ExternalToolInput
                    {
                        ToolPath = GetTransformExePath(context).AbsolutePath,
                        Arguments = context.Data
                            .Root
                            .GetDirectory("src")
                            .GetDirectory("CrystalQuartz.Web/Content")
                            .GetFile("index.tt").AbsolutePath
                    }),

                    //// Build solution
                    new MsBuildTask<Context>()
                        .FillInput(context => new MsBuildInput()),

                    //// Clean artifacts
                    Task((builder, context) => context.Data.Artifacts.Files.IncludeByExtension("nupkg", "nuspec").DeleteAll()),

                    //// Generate simple package spec
                    new GenerateNuGetSpecTask<Context>((context, input) => input
                        .Id("CrystalQuartz.Simple")
                        .FillCommonProperties(context.Data)
                        .Description("Installs CrystalQuartz panel (pluggable Qurtz.NET viewer) using simple scheduler provider. This approach is appropriate for scenarios where the scheduler and a web application works in the same AppDomain.")
                        .WithFiles(context.Data.BuildAssets.GetDirectory("Simple").Files, "content")
                        .ToFile(context.Data.Artifacts.GetFile("CrystalQuartz.Simple.nuspec"))),

                    //// Generate remote package spec
                    new GenerateNuGetSpecTask<Context>((context, input) => input
                        .Id("CrystalQuartz.Remote")
                        .FillCommonProperties(context.Data)
                        .Description("Installs CrystalQuartz panel (pluggable Qurtz.NET viewer) using remote scheduler provider. Note that you should set remote scheduler URI after the installation.")
                        .WithFiles(context.Data.BuildAssets.GetDirectory("Remote").Files, "content")
                        .ToFile(context.Data.Artifacts.GetFile("CrystalQuartz.Remote.nuspec"))),

                    //// Generate NuGet packages
                    ForEach(c => c.Data.Artifacts.Files.IncludeByExtension(".nuspec"))
                        .Do((context, file) => new GeneratePackageTask<Context>(file))
                );
            }
        }
    }
}