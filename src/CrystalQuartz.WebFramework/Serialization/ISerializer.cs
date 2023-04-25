namespace CrystalQuartz.WebFramework.Serialization
{
    using System.IO;
    using System.Threading.Tasks;

    public interface ISerializer<in T>
    {
        Task Serialize(T target, TextWriter output);
    }
}