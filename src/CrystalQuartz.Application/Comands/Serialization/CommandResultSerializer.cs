using System.IO;
using CrystalQuartz.WebFramework.Commands;

namespace CrystalQuartz.Application.Comands.Serialization
{
    using System.Threading.Tasks;

    public class CommandResultSerializer : CommandResultSerializerBase<CommandResult>
    {
#if NET40
        private static readonly Task CompletedTask = new Task(() => { });
#endif
        protected override Task SerializeSuccessData(CommandResult target, TextWriter output) =>
#if NET40
            CompletedTask;
#else
            Task.CompletedTask;
#endif
    }
}