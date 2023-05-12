namespace CrystalQuartz.WebFramework
{
    using System.Threading.Tasks;
    using CrystalQuartz.WebFramework.HttpAbstractions;

    public interface IRunningApplication
    {
        public Task Handle(IRequest request, IResponseRenderer renderer);
    }
}