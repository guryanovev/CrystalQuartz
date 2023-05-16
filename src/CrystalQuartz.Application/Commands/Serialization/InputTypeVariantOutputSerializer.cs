namespace CrystalQuartz.Application.Commands.Serialization
{
    using System.IO;
    using System.Threading.Tasks;
    using CrystalQuartz.Core.Domain.ObjectInput;
    using CrystalQuartz.WebFramework.Serialization;
    using Outputs;

    public class InputTypeVariantOutputSerializer : CommandResultSerializerBase<InputTypeVariantsOutput>
    {
        private static readonly ItemTypeVarianSerializer ItemSerializer = new ItemTypeVarianSerializer();

        protected override async Task SerializeSuccessData(InputTypeVariantsOutput target, TextWriter output)
        {
            await output.WriteAsync(',');
            await output.WritePropertyName("i");
            await output.WriteArray(target.Items, ItemSerializer);
        }
    }

    class ItemTypeVarianSerializer : ISerializer<InputVariant>
    {
        public async Task Serialize(InputVariant target, TextWriter output)
        {
            await output.WriteAsync('{');
            await output.WritePropertyName("_");
            await output.WriteValueString(target.Value);

            await output.WriteAsync(',');
            await output.WritePropertyName("l");
            await output.WriteValueString(target.Label);

            await output.WriteAsync('}');
        }
    }
}