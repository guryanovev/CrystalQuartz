namespace CrystalQuartz.Application.Comands.Serialization
{
    using System.IO;
    using System.Threading.Tasks;
    using CrystalQuartz.Core.Domain.Base;
    using CrystalQuartz.WebFramework.Serialization;

    public class ErrorMessageSerializer : ISerializer<ErrorMessage>
    {
        public async Task Serialize(ErrorMessage target, TextWriter output)
        {
            await output.WriteAsync('{');
            await output.WritePropertyName("_");
            await output.WriteValueString(target.Message);

            if (target.Level > 0)
            {
                await output.WriteAsync(',');
                await output.WritePropertyName("l");
                await output.WriteValueNumber(target.Level);
            }
            
            await output.WriteAsync('}');
        }
    }
}