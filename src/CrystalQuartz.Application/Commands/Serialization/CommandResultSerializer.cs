namespace CrystalQuartz.Application.Commands.Serialization
{
    using System.IO;
    using System.Threading.Tasks;
    using CrystalQuartz.WebFramework.Commands;

    public class CommandResultSerializer : CommandResultSerializerBase<CommandResult>
    {
        protected override Task SerializeSuccessData(CommandResult target, TextWriter output) =>
            AsyncUtils.CompletedTask();
    }
}