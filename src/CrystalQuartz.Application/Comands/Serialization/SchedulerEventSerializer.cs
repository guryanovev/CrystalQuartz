namespace CrystalQuartz.Application.Comands.Serialization
{
    using System.Globalization;
    using System.IO;
    using CrystalQuartz.Core.Domain.Events;
    using CrystalQuartz.Core.Services;
    using CrystalQuartz.WebFramework.Serialization;

    public class SchedulerEventSerializer : ISerializer<SchedulerEvent>
    {
        public void Serialize(SchedulerEvent target, TextWriter output)
        {
            output.Write('{');
            output.WritePropertyName("_");
            output.Write('"');
            output.Write(target.Id.ToString(CultureInfo.InvariantCulture));
            output.Write('|');
            output.Write(target.Date.ToString(CultureInfo.InvariantCulture));
            output.Write('|');
            output.Write(((int) target.EventType).ToString(CultureInfo.InvariantCulture));
            output.Write('|');
            output.Write(((int) target.Scope).ToString(CultureInfo.InvariantCulture));
            output.Write('"');

            if (target.FireInstanceId != null)
            {
                output.Write(',');
                output.WritePropertyName("fid");
                output.WriteValueString(target.FireInstanceId);
            }

            if (target.Faulted)
            {
                output.Write(',');
                output.WritePropertyName("_err");

                if (target.Errors != null)
                {
                    output.WriteArray(target.Errors, CommonSerializers.ErrorMessageSerializer);
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