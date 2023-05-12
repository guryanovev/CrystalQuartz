namespace CrystalQuartz.WebFramework.Request
{
    using CrystalQuartz.WebFramework.HttpAbstractions;

    public interface IRequestHandler
    {
        RequestHandlingResult HandleRequest(IRequest request);
    }
}