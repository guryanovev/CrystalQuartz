namespace CrystalQuartz.WebFramework.Response
{
    using CrystalQuartz.WebFramework.HttpAbstractions;

    public interface IResponseFiller
    {
        Response FillResponse(IRequest request);
    }
}