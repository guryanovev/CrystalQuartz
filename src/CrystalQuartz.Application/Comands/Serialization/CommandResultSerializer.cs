using System.IO;
using CrystalQuartz.WebFramework.Commands;

namespace CrystalQuartz.Application.Comands.Serialization
{
    public class CommandResultSerializer : CommandResultSerializerBase<CommandResult>
    {
        protected override void SerializeSuccessData(CommandResult target, StreamWriter output)
        {
        }
    }
}