using System.IO;
using CrystalQuartz.WebFramework.Commands;

namespace CrystalQuartz.Application.Comands.Serialization
{
    using System.Threading.Tasks;

    public class CommandResultSerializer : CommandResultSerializerBase<CommandResult>
    {
        protected override Task SerializeSuccessData(CommandResult target, TextWriter output) => Task.CompletedTask;
    }
}