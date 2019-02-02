namespace CrystalQuartz.Application.Comands.Serialization
{
    using System.IO;
    using CrystalQuartz.Application.Comands.Outputs;
    using CrystalQuartz.Core.Domain.ObjectInput;
    using CrystalQuartz.WebFramework.Serialization;

    public class InputTypeVariantOutputSerializer : CommandResultSerializerBase<InputTypeVariantsOutput>
    {
        private static readonly ItemTypeVarianSerializer ItemSerializer = new ItemTypeVarianSerializer();

        protected override void SerializeSuccessData(InputTypeVariantsOutput target, TextWriter output)
        {
            output.Write(',');
            output.WritePropertyName("i");
            output.WriteArray(target.Items, ItemSerializer);
        }
    }

    class ItemTypeVarianSerializer : ISerializer<InputVariant>
    {
        public void Serialize(InputVariant target, TextWriter output)
        {
            output.Write('{');
            output.WritePropertyName("_");
            output.WriteValueString(target.Value);

            output.Write(',');
            output.WritePropertyName("l");
            output.WriteValueString(target.Label);

            output.Write('}');
        }
    }
}