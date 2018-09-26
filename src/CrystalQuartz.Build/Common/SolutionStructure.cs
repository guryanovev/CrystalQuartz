namespace CrystalQuartz.Build.Common
{
    using Rosalia.FileSystem;

    public class SolutionStructure
    {
        private readonly IDirectory _root;

        public SolutionStructure(IDirectory root)
        {
            _root = root;
        }

        public IDirectory Root
        {
            get { return _root; }
        }

        public IDirectory Artifacts
        {
            get { return Root/"Artifacts"; }
        }

        public IDirectory Src
        {
            get { return Root/"src"; }
        }

        public IDirectory Docs
        {
            get { return Root/"docs"; }
        }

        public IDirectory BuildAssets
        {
            get { return Src/"CrystalQuartz.Build"/"Assets"; }
        }

        public IDirectory CrystalQuartz_Application
        {
            get { return Src/"CrystalQuartz.Application"; }
        }

        public IDirectory CrystalQuartz_Application_Client
        {
            get { return Src/"CrystalQuartz.Application.Client"; }
        }
    }
}