namespace CrystalQuartz.Application.Comands.Serialization
{
    using System.Globalization;
    using System.IO;
    using System.Threading.Tasks;
    using CrystalQuartz.Core.Domain.Events;
    using CrystalQuartz.Core.Services;
    using CrystalQuartz.WebFramework.Serialization;

    public class SchedulerEventSerializer : ISerializer<SchedulerEvent>
    {
        public async Task Serialize(SchedulerEvent target, TextWriter output)
        {
            await output.WriteAsync('{');
            await output.WritePropertyName("_");
            await output.WriteAsync('"');
            await output.WriteAsync(target.Id.ToString(CultureInfo.InvariantCulture));
            await output.WriteAsync('|');
            await output.WriteAsync(target.Date.ToString(CultureInfo.InvariantCulture));
            await output.WriteAsync('|');
            await output.WriteAsync(((int) target.EventType).ToString(CultureInfo.InvariantCulture));
            await output.WriteAsync('|');
            await output.WriteAsync(((int) target.Scope).ToString(CultureInfo.InvariantCulture));
            await output.WriteAsync('"');

            if (target.ItemKey != null)
            {
                await output.WriteAsync(',');
                await output.WritePropertyName("k");
                await output.WriteValueString(target.ItemKey);
            }

            if (target.FireInstanceId != null)
            {
                await output.WriteAsync(',');
                await output.WritePropertyName("fid");
                await output.WriteValueString(target.FireInstanceId);
            }

            if (target.Faulted)
            {
                await output.WriteAsync(',');
                await output.WritePropertyName("_err");

                if (target.Errors != null)
                {
                    await output.WriteArray(target.Errors, CommonSerializers.ErrorMessageSerializer);
                }
                else
                {
                    await output.WriteAsync('1');
                }
            }

            await output.WriteAsync('}');
        }
    }
}