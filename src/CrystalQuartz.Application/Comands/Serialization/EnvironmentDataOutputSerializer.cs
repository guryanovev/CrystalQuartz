using System.IO;
using CrystalQuartz.Application.Comands.Outputs;
using CrystalQuartz.WebFramework.Serialization;

namespace CrystalQuartz.Application.Comands.Serialization
{
    using System.Threading.Tasks;

    public class EnvironmentDataOutputSerializer : CommandResultSerializerBase<EnvironmentDataOutput>
    {
        protected override async Task SerializeSuccessData(EnvironmentDataOutput target, TextWriter output)
        {
            await output.WriteAsync(',');
            await output.WritePropertyName("sv");
            await output.WriteValueStringEscaped(target.SelfVersion);

            await output.WriteAsync(',');
            await output.WritePropertyName("qv");
            await output.WriteValueStringEscaped(target.QuartzVersion);

            await output.WriteAsync(',');
            await output.WritePropertyName("dnv");
            await output.WriteValueStringEscaped(target.DotNetVersion);

            await output.WriteAsync(',');
            await output.WritePropertyName("ts");
            await output.WriteValueNumber(target.TimelineSpan);

            if (!string.IsNullOrEmpty(target.CustomCssUrl))
            {
                await output.WriteAsync(',');
                await output.WritePropertyName("ccss");
                await output.WriteValueStringEscaped(target.CustomCssUrl);
            }
        }
    }
}