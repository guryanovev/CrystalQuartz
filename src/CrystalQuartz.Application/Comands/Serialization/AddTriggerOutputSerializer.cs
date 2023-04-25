namespace CrystalQuartz.Application.Comands.Serialization
{
    using System.IO;
    using System.Threading.Tasks;
    using CrystalQuartz.Application.Comands.Outputs;

    public class AddTriggerOutputSerializer : CommandResultSerializerBase<AddTriggerOutput>
    {
        protected override async Task SerializeSuccessData(AddTriggerOutput target, TextWriter output)
        {
            if (target.ValidationErrors != null)
            {
                await output.WriteAsync(',');
                await output.WritePropertyName("ve");
                await output.WriteAsync('{');

                var first = true;
                foreach (var targetValidationError in target.ValidationErrors)
                {
                    if (!first)
                    {
                        await output.WriteAsync(',');
                    }

                    await output.WriteValueString(targetValidationError.Key);
                    await output.WriteAsync(':');
                    await output.WriteValueString(targetValidationError.Value);

                    first = false;
                }

                await output.WriteAsync('}');
            }
        }
    }
}