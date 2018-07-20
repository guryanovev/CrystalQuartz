using System.Globalization;
using System.IO;
using CrystalQuartz.Core.Domain.Activities;
using CrystalQuartz.Core.Domain.TriggerTypes;
using CrystalQuartz.WebFramework.Serialization;

namespace CrystalQuartz.Application.Comands.Serialization
{
    public abstract class ActivitySerializer<T> : ISerializer<T> where T : Activity
    {
        public void Serialize(T target, StreamWriter output)
        {
            output.Write('{');
            output.WritePropertyName("n");
            output.WriteValueString(target.Name);
            output.Write(',');
            output.WritePropertyName("s");
            output.WriteValueNumber((int) target.Status);

            SerializeInternal(target, output);

            output.Write('}');
        }

        protected abstract void SerializeInternal(T target, StreamWriter output);
    }

    public class JobGroupSerializer : ActivitySerializer<JobGroupData>
    {
        private static readonly JobSerializer JobSerializer = new JobSerializer();

        protected override void SerializeInternal(JobGroupData target, StreamWriter output)
        {
            if (target.Jobs != null && target.Jobs.Count > 0)
            {
                output.Write(',');
                output.WritePropertyName("jb");
                output.WriteArray(target.Jobs, JobSerializer);
            }
        }
    }

    public class JobSerializer : ActivitySerializer<JobData>
    {
        private static readonly TriggerSerializer TriggerSerializer = new TriggerSerializer();

        protected override void SerializeInternal(JobData target, StreamWriter output)
        {
            output.Write(',');
            output.WritePropertyName("_");
            output.WriteValueString(target.UniqueName);

            output.Write(',');
            output.WritePropertyName("gn");
            output.WriteValueString(target.GroupName);

            if (target.Triggers != null && target.Triggers.Count > 0)
            {
                output.Write(',');
                output.WritePropertyName("tr");
                output.WriteArray(target.Triggers, TriggerSerializer);
            }
        }
    }

    public class TriggerSerializer : ActivitySerializer<TriggerData>
    {
        protected override void SerializeInternal(TriggerData target, StreamWriter output)
        {
            output.Write(',');
            output.WritePropertyName("_");
            output.WriteValueString(target.UniqueTriggerKey);

            output.Write(',');
            output.WritePropertyName("gn");
            output.WriteValueString(target.GroupName);

            output.Write(',');
            output.WritePropertyName("sd");
            output.WriteValueNumber(target.StartDate);

            if (target.EndDate.HasValue)
            {
                output.Write(',');
                output.WritePropertyName("ed");
                output.WriteValueNumber(target.EndDate.Value);
            }

            if (target.NextFireDate.HasValue)
            {
                output.Write(',');
                output.WritePropertyName("nfd");
                output.WriteValueNumber(target.NextFireDate.Value);
            }

            if (target.PreviousFireDate.HasValue)
            {
                output.Write(',');
                output.WritePropertyName("pfd");
                output.WriteValueNumber(target.PreviousFireDate.Value);
            }

            if (target.TriggerType != null)
            {
                output.Write(',');
                output.WritePropertyName("tc");
                output.WriteValueStringEscaped(target.TriggerType.Code);

                var simpleTriggerType = target.TriggerType as SimpleTriggerType;
                if (simpleTriggerType != null)
                {
                    output.Write(',');
                    output.WritePropertyName("tb");
                    output.WriteValueString(
                        simpleTriggerType.RepeatCount.ToString(CultureInfo.InvariantCulture) +
                        '|' +
                        simpleTriggerType.RepeatInterval.ToString(CultureInfo.InvariantCulture) + 
                        '|' +
                        simpleTriggerType.TimesTriggered.ToString(CultureInfo.InvariantCulture));
                }

                var cronTriggerType = target.TriggerType as CronTriggerType;
                if (cronTriggerType != null)
                {
                    output.Write(',');
                    output.WritePropertyName("tb");
                    output.WriteValueString(cronTriggerType.CronExpression);
                }
            }
        }
    }
}