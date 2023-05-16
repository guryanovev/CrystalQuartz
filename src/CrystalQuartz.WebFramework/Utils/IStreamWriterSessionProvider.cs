namespace CrystalQuartz.WebFramework.Utils
{
    using System;
    using System.IO;
    using System.Threading.Tasks;

    public interface IStreamWriterSessionProvider
    {
        Task UseWriter(Stream output, Func<StreamWriter, Task> payload);
    }
}