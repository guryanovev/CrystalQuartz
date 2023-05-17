namespace CrystalQuartz.WebFramework.Utils
{
    using System;
    using System.IO;
    using System.Threading.Tasks;

    public class StandardStreamWriterSessionProvider : IStreamWriterSessionProvider
    {
        public async Task UseWriter(Stream output, Func<StreamWriter, Task> payload)
        {
            using StreamWriter writer = new StreamWriter(output);
            {
                await payload.Invoke(writer);
            }
        }
    }
}