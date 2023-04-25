namespace CrystalQuartz.AspNetCore
{
    using System;
    using System.IO;
    using System.Threading.Tasks;
    using WebFramework.Utils;

    public class AsyncStreamWriterSessionProvider : IStreamWriterSessionProvider
    {
        public async Task UseWriter(Stream output, Func<StreamWriter, Task> payload)
        {
            await using StreamWriter writer = new StreamWriter(output);
            await payload.Invoke(writer);
        }
    }
}