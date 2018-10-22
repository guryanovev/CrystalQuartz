namespace CrystalQuartz.Application.Comands.Serialization
{
    using System.IO;
    using CrystalQuartz.Application.Comands.Outputs;

    public class TriggerDetailsOutputSerializer : CommandResultSerializerBase<TriggerDetailsOutput>
    {
        protected override void SerializeSuccessData(TriggerDetailsOutput target, TextWriter output)
        {
            if (target.JobDataMap != null)
            {
                output.Write(',');
                output.WritePropertyName("jdm");
                CommonSerializers.PropertySerializer.Serialize(target.JobDataMap, output);
            }

            if (target.TriggerData != null)
            {
                output.Write(',');
                output.WritePropertyName("t");
                CommonSerializers.TriggerDataSerializer.Serialize(target.TriggerData, output);
            }

            var secondaryData = target.TriggerSecondaryData;
            if (secondaryData != null)
            {
                output.Write(',');
                output.WritePropertyName("ts");

                output.Write('{');

                output.WritePropertyName("mfi");
                output.WriteValueNumber(secondaryData.MisfireInstruction);

                output.Write(',');
                output.WritePropertyName("p");
                output.WriteValueNumber(secondaryData.Priority);

                if (secondaryData.Description != null)
                {
                    output.Write(',');
                    output.WritePropertyName("d");
                    output.WriteValueString(secondaryData.Description);
                }

                output.Write('}');
            }
        }
    }
}