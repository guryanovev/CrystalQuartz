namespace CrystalQuartz.WebFramework.Commands
{
    using System.Threading.Tasks;

    public interface ICommand<in TInput>
    {
        Task<object> Execute(TInput input);
    }
}