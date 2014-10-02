namespace CrystalQuartz.Build
{
    using Rosalia.Core.FileSystem;

    public class Context
    {
        public Context()
        {
            Configuration = "Debug";
        }

        public string Configuration { get; set; }

        public string Version { get; set; }

        public IDirectory Root { get; set; }

        public IDirectory Artifacts
        {
            get { return Root.GetDirectory("artifacts"); }
        }

        public IDirectory BuildAssets
        {
            get { return Root.GetDirectory("src\\CrystalQuartz.Build\\Assets"); }
        }
    }
}