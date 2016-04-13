namespace CrystalQuartz.WebFramework.HttpAbstractions
{
    public interface IRequest
    {
        string this[string key]
        {
            get;
        }
    }
}