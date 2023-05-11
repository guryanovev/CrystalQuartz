using System.Threading.Tasks;

namespace CrystalQuartz.WebFramework
{
    using HttpAbstractions;

    public interface IRunningApplication
    {
        public Task Handle(IRequest request, IResponseRenderer renderer);
    }
}