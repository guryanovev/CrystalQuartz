using System.IO;
using CrystalQuartz.Application.Comands.Outputs;
using CrystalQuartz.WebFramework.Serialization;

namespace CrystalQuartz.Application.Comands.Serialization
{
    public class EnvironmentDataOutputSerializer : CommandResultSerializerBase<EnvironmentDataOutput>
    {
        protected override void SerializeSuccessData(EnvironmentDataOutput target, StreamWriter output)
        {
            output.Write(',');
            output.WritePropertyName("sv");
            output.WriteValueStringEscaped(target.SelfVersion);

            output.Write(',');
            output.WritePropertyName("qv");
            output.WriteValueStringEscaped(target.QuartzVersion);

            output.Write(',');
            output.WritePropertyName("dnv");
            output.WriteValueStringEscaped(target.DotNetVersion);

            output.Write(',');
            output.WritePropertyName("ts");
            output.WriteValueNumber(target.TimelineSpan);

            if (!string.IsNullOrEmpty(target.CustomCssUrl))
            {
                output.Write(',');
                output.WritePropertyName("ccss");
                output.WriteValueStringEscaped(target.CustomCssUrl);
            }
        }
    }
}