namespace CrystalQuartz.WebFramework.Routing
{
    using CrystalQuartz.WebFramework.HttpAbstractions;

    public interface IRequestMatcher
    {
        bool CanProcessRequest(IRequest request);
    }
}