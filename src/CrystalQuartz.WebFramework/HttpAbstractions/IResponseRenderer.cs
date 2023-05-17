namespace CrystalQuartz.WebFramework.HttpAbstractions
{
    using System.Threading.Tasks;

    public interface IResponseRenderer
    {
        Task Render(Response response);
    }
}