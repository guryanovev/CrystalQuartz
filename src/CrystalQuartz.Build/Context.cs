namespace CrystalQuartz.Build
{
    using Rosalia.Core.FileSystem;

    public class Context
    {
        public string Configuration { get; set; }

        public string Version { get; set; }

        public IFile SolutionFile { get; set; }

        public IFile NugetExe { get; set; }

        public IDirectory ProjectRootDirectory { get; set; }

        public IDirectory Src { get; set; }

        public IDirectory Artifacts { get; set; }

        public IDirectory BuildAssets
        {
            get { return Src.GetDirectory(@"CrystalQuartz.Build\Assets"); }
        }
    }
}