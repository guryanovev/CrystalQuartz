﻿using Rosalia.TaskLib.NuGet.Tasks;

namespace CrystalQuartz.Build.Extensions
{
    using System.Linq;
    using Rosalia.FileSystem;

    public class TargetedFile
    {
        private readonly IFile _file;
        private readonly string _targetVersion;

        public TargetedFile(IFile file, string targetVersion)
        {
            _file = file;
            _targetVersion = targetVersion;
        }

        public IFile File
        {
            get { return _file; }
        }

        public string TargetVersion
        {
            get { return _targetVersion; }
        }
    }

    public static class SpecInputExtensions
    {
        public static GenerateNuGetSpecTask FillCommonProperties(
            this GenerateNuGetSpecTask input, 
            IDirectory solutionDir,
            IDirectory dependenciesProject,
            string version,
            params TargetedFile[] libBinaries)
        {
            IFile logoFile = solutionDir/"assets"/"logo.png";

            return libBinaries
                .Concat(
                    libBinaries
                        .Select(libFile =>
                        {
                            IFile xmlDocFile = libFile.File.Directory / (libFile.File.NameWithoutExtension + ".xml");

                            return new TargetedFile(xmlDocFile, libFile.TargetVersion);
                        })
                        .Where(targetFile => targetFile.File.Exists))
                .Aggregate(
                    input
                        .Version(version)
                        .Authors("Eugene Guryanov")
                        .Owners("Eugene Guryanov")
                        .LicenseUrl("https://github.com/guryanovev/CrystalQuartz/blob/master/LICENCE.txt")
                        .ProjectUrl("https://github.com/guryanovev/CrystalQuartz")
                        .Tags(".NET", "ASP.NET", "Quartz.NET", "Scheduler", "Job", "Trigger")
                        .WithDependenciesFromPackagesConfig(dependenciesProject, ignoreFrameworkVersion: true)
                        .WithFile(logoFile, "images")
                        ,

                    (x, file) => x.WithFile(
                        file.File.GetRelativePath(dependenciesProject.Parent.Parent/"Artifacts"), "lib/" + file.TargetVersion));
        }
    }
}