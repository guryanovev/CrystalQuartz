using System.IO;

namespace CrystalQuartz.WebFramework.Serialization
{
    public interface ISerializer<in T>
    {
        void Serialize(T target, StreamWriter output);
    }
}