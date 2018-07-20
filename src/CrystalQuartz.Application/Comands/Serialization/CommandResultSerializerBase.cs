using System.IO;
using CrystalQuartz.WebFramework.Commands;
using CrystalQuartz.WebFramework.Serialization;

namespace CrystalQuartz.Application.Comands.Serialization
{
    public abstract class CommandResultSerializerBase<T> : ISerializer<T> where T : CommandResult
    {
        public void Serialize(T target, StreamWriter output)
        {
            output.Write('{');

            if (target == null)
            {
                output.WriteNull();
            }
            else if (target.Success)
            {
                output.WritePropertyName("_ok");
                output.WriteValueNumber(1);

                SerializeSuccessData(target, output);
            } else if (!string.IsNullOrEmpty(target.ErrorMessage))
            {
                output.WritePropertyName("_err");
                output.WriteValueString(target.ErrorMessage);
            }

            output.Write('}');
        }

        protected abstract void SerializeSuccessData(T target, StreamWriter output);
    }
}