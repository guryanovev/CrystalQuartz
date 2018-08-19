namespace CrystalQuartz.Application.Comands.Serialization
{
    using System.Globalization;
    using System.IO;
    using CrystalQuartz.Core.Domain.Events;
    using CrystalQuartz.Core.Services;
    using CrystalQuartz.WebFramework.Serialization;

    public class SchedulerEventSerializer : ISerializer<SchedulerEventData>
    {
        public void Serialize(SchedulerEventData target, TextWriter output)
        {
            output.Write('{');
            output.WritePropertyName("_");
            output.Write('"');
            output.Write(target.Id.ToString(CultureInfo.InvariantCulture));
            output.Write('|');
            output.Write(target.Date.ToString(CultureInfo.InvariantCulture));
            output.Write('|');
            output.Write(((int) target.Data.EventType).ToString(CultureInfo.InvariantCulture));
            output.Write('|');
            output.Write(((int) target.Data.Scope).ToString(CultureInfo.InvariantCulture));
            output.Write('"');

            if (target.Data.FireInstanceId != null)
            {
                output.Write(',');
                output.WritePropertyName("fid");
                output.WriteValueString(target.Data.FireInstanceId);
            }

            if (target.Data.Faulted)
            {
                output.Write(',');
                output.WritePropertyName("_err");

                if (target.Data.Errors != null)
                {
                    output.WriteArray(target.Data.Errors, CommonSerializers.ErrorMessageSerializer);
                }
                else
                {
                    output.Write('1');
                }
            }

            output.Write('}');
        }
    }
}