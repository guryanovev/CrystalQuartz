namespace CrystalQuartz.Application.Comands.Serialization
{
    using System.IO;
    using CrystalQuartz.Application.Comands.Outputs;

    public class AddTriggerOutputSerializer : CommandResultSerializerBase<AddTriggerOutput>
    {
        protected override void SerializeSuccessData(AddTriggerOutput target, TextWriter output)
        {
            if (target.ValidationErrors != null)
            {
                output.Write(',');
                output.WritePropertyName("ve");
                output.Write('{');

                var first = true;
                foreach (var targetValidationError in target.ValidationErrors)
                {
                    if (!first)
                    {
                        output.Write(',');
                    }

                    output.WriteValueString(targetValidationError.Key);
                    output.Write(':');
                    output.WriteValueString(targetValidationError.Value);

                    first = false;
                }

                output.Write('}');
            }
        }
    }
}