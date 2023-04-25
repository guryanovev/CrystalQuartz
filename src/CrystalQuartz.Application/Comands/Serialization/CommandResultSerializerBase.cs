namespace CrystalQuartz.Application.Comands.Serialization
{
    using System.Threading.Tasks;
    using System.IO;
    using CrystalQuartz.WebFramework.Commands;
    using CrystalQuartz.WebFramework.Serialization;

    public abstract class CommandResultSerializerBase<T> : ISerializer<T> where T : CommandResult
    {
        public async Task Serialize(T target, TextWriter output)
        {
            await output.WriteAsync('{');

            if (target == null)
            {
                await output.WriteNull();
            }
            else if (target.Success)
            {
                await output.WritePropertyName("_ok");
                await output.WriteValueNumber(1);

                await SerializeSuccessData(target, output);
            } else if (!string.IsNullOrEmpty(target.ErrorMessage))
            {
                await output.WritePropertyName("_err");
                await output.WriteValueString(target.ErrorMessage);
            }

            await output.WriteAsync('}');
        }

        protected abstract Task SerializeSuccessData(T target, TextWriter output);
    }
}