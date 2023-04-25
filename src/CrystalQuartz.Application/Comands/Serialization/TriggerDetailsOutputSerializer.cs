namespace CrystalQuartz.Application.Comands.Serialization
{
    using System.IO;
    using System.Threading.Tasks;
    using CrystalQuartz.Application.Comands.Outputs;

    public class TriggerDetailsOutputSerializer : CommandResultSerializerBase<TriggerDetailsOutput>
    {
        protected override async Task SerializeSuccessData(TriggerDetailsOutput target, TextWriter output)
        {
            if (target.JobDataMap != null)
            {
                await output.WriteAsync(',');
                await output.WritePropertyName("jdm");
                await CommonSerializers.PropertySerializer.Serialize(target.JobDataMap, output);
            }

            if (target.TriggerData != null)
            {
                await output.WriteAsync(',');
                await output.WritePropertyName("t");
                await CommonSerializers.TriggerDataSerializer.Serialize(target.TriggerData, output);
            }

            var secondaryData = target.TriggerSecondaryData;
            if (secondaryData != null)
            {
                await output.WriteAsync(',');
                await output.WritePropertyName("ts");

                await output.WriteAsync('{');

                await output.WritePropertyName("mfi");
                await output.WriteValueNumber(secondaryData.MisfireInstruction);

                await output.WriteAsync(',');
                await output.WritePropertyName("p");
                await output.WriteValueNumber(secondaryData.Priority);

                if (secondaryData.Description != null)
                {
                    await output.WriteAsync(',');
                    await output.WritePropertyName("d");
                    await output.WriteValueString(secondaryData.Description);
                }

                await output.WriteAsync('}');
            }
        }
    }
}