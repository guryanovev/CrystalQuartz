namespace CrystalQuartz.WebFramework.Commands
{
    public interface ICommand<in TInput>
    {
        object Execute(TInput input);
    }
}