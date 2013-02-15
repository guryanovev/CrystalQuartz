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