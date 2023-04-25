namespace CrystalQuartz.Application.Comands.Serialization
{
    using System.IO;
    using System.Threading.Tasks;
    using CrystalQuartz.Application.Comands.Outputs;
    using CrystalQuartz.WebFramework.Serialization;

    public class InputTypeOptionsSerializer : CommandResultSerializerBase<InputTypesOutput>
    {
        private static readonly ItemTypeInfoSerializer ItemTypeInfoSerializer = new ItemTypeInfoSerializer();

        protected override async Task SerializeSuccessData(InputTypesOutput target, TextWriter output)
        {
            await output.WriteAsync(',');
            await output.WritePropertyName("i");

            await output.WriteArray(target.Items, ItemTypeInfoSerializer);
        }
    }

    class ItemTypeInfoSerializer : ISerializer<InputTypeItem>
    {
        public async Task Serialize(InputTypeItem target, TextWriter output)
        {
            await output.WriteAsync('{');
            await output.WritePropertyName("_");
            await output.WriteValueString(target.Code);

            await output.WriteAsync(',');
            await output.WritePropertyName("l");
            await output.WriteValueString(target.Label);

            await output.WriteAsync(',');
            await output.WritePropertyName("v");
            await output.WriteValueNumber(target.HasVariants ? 1 : 0);

            await output.WriteAsync('}');
        }
    }
}