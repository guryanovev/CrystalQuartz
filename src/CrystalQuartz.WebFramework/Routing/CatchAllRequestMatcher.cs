namespace CrystalQuartz.WebFramework.Routing
{
    using CrystalQuartz.WebFramework.HttpAbstractions;

    public class CatchAllRequestMatcher : IRequestMatcher
    {
        public bool CanProcessRequest(IRequest request)
        {
            return true;
        }
    }
}