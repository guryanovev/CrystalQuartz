namespace CrystalQuartz.Application.Comands.Serialization
{
    using System.IO;
    using CrystalQuartz.Application.Comands.Outputs;
    using CrystalQuartz.WebFramework.Serialization;

    public class InputTypeOptionsSerializer : CommandResultSerializerBase<InputTypesOutput>
    {
        private static readonly ItemTypeInfoSerializer ItemTypeInfoSerializer = new ItemTypeInfoSerializer();

        protected override void SerializeSuccessData(InputTypesOutput target, TextWriter output)
        {
            output.Write(',');
            output.WritePropertyName("i");
            output.WriteArray(target.Items, ItemTypeInfoSerializer);
        }
    }

    class ItemTypeInfoSerializer : ISerializer<InputTypeItem>
    {
        public void Serialize(InputTypeItem target, TextWriter output)
        {
            output.Write('{');
            output.WritePropertyName("_");
            output.WriteValueString(target.Code);

            output.Write(',');
            output.WritePropertyName("l");
            output.WriteValueString(target.Label);

            output.Write(',');
            output.WritePropertyName("v");
            output.WriteValueNumber(target.HasVariants ? 1 : 0);

            output.Write('}');
        }
    }
}