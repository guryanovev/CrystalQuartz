using System.Globalization;
using System.IO;
using CrystalQuartz.Application.Comands.Outputs;
using CrystalQuartz.Core.Timeline;

namespace CrystalQuartz.Application.Comands.Serialization
{
    public class SchedulerDataOutputSerializer : CommandResultSerializerBase<SchedulerDataOutput>
    {
        protected override void SerializeSuccessData(SchedulerDataOutput target, TextWriter output)
        {
            output.Write(',');
            output.WritePropertyName("n");
            output.WriteValueString(target.Name);

            output.Write(',');
            output.WritePropertyName("_");
            output.WriteValueString(target.InstanceId);

            output.Write(',');
            output.WritePropertyName("sim");
            output.WriteValueNumber(target.ServerInstanceMarker);

            output.Write(',');
            output.WritePropertyName("st");
            output.WriteValueString(target.Status);

            output.Write(',');
            output.WritePropertyName("jt");
            output.WriteValueNumber(target.JobsTotal);

            output.Write(',');
            output.WritePropertyName("je");
            output.WriteValueNumber(target.JobsExecuted);

            if (target.RunningSince.HasValue)
            {
                output.Write(',');
                output.WritePropertyName("rs");
                output.WriteValueNumber(target.RunningSince.Value);
            }

            /* Events */
            if (target.Events != null && target.Events.Length > 0)
            {
                output.Write(',');
                output.WritePropertyName("ev");
                output.Write('[');
                for (var i = 0; i < target.Events.Length; i++)
                {
                    if (i > 0)
                    {
                        output.Write(',');
                    }

                    SchedulerEventData eventData = target.Events[i];
                    output.Write('"');
                    output.Write(eventData.Id.ToString(CultureInfo.InvariantCulture));
                    output.Write('|');
                    output.Write(eventData.Date.ToString(CultureInfo.InvariantCulture));
                    output.Write('|');
                    output.Write(eventData.Data.EventType.ToString(CultureInfo.InvariantCulture));
                    output.Write('|');
                    output.Write(eventData.Data.Scope.ToString(CultureInfo.InvariantCulture));
                    output.Write('|');
                    output.Write(eventData.Data.FireInstanceId);
                    output.Write('|');
                    output.Write(eventData.Data.ItemKey);
                    output.Write('"');
                }

                output.Write(']');
            }

            if (target.InProgress != null && target.InProgress.Length > 0)
            {
                output.Write(',');
                output.WritePropertyName("ip");
                output.Write('[');
                for (var i = 0; i < target.InProgress.Length; i++)
                {
                    if (i > 0)
                    {
                        output.Write(',');
                    }

                    var executingJobInfo = target.InProgress[i];
                    output.WriteValueString(executingJobInfo.FireInstanceId + "|" + executingJobInfo.UniqueTriggerKey);
                }

                output.Write(']');
            }

            if (target.JobGroups != null && target.JobGroups.Length > 0)
            {
                output.Write(',');
                output.WritePropertyName("jg");
                output.WriteArray(target.JobGroups, new JobGroupSerializer());
            }
        }
    }
}