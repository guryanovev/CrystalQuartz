namespace CrystalQuartz.Application.Commands.Serialization
{
    using System.Globalization;
    using System.IO;
    using System.Threading.Tasks;
    using CrystalQuartz.Core.Domain.Activities;
    using CrystalQuartz.Core.Domain.TriggerTypes;
    using CrystalQuartz.WebFramework.Serialization;

    public abstract class ActivitySerializer<T> : ISerializer<T> where T : Activity
    {
        public async Task Serialize(T target, TextWriter output)
        {
            await output.WriteAsync('{');
            await output.WritePropertyName("n");
            await output.WriteValueString(target.Name);
            await output.WriteAsync(',');
            await output.WritePropertyName("s");
            await output.WriteValueNumber((int) target.Status);

            await SerializeInternal(target, output);

            await output.WriteAsync('}');
        }

        protected abstract Task SerializeInternal(T target, TextWriter output);
    }

    public class JobGroupSerializer : ActivitySerializer<JobGroupData>
    {
        private static readonly JobSerializer JobSerializer = new JobSerializer();

        protected override async Task SerializeInternal(JobGroupData target, TextWriter output)
        {
            if (target.Jobs != null && target.Jobs.Count > 0)
            {
                await output.WriteAsync(',');
                await output.WritePropertyName("jb");
                await output.WriteArray(target.Jobs, JobSerializer);
            }
        }
    }

    public class JobSerializer : ActivitySerializer<JobData>
    {
        private static readonly TriggerSerializer TriggerSerializer = new TriggerSerializer();

        protected override async Task SerializeInternal(JobData target, TextWriter output)
        {
            await output.WriteAsync(',');
            await output.WritePropertyName("_");
            await output.WriteValueString(target.UniqueName);

            await output.WriteAsync(',');
            await output.WritePropertyName("gn");
            await output.WriteValueString(target.GroupName);

            if (target.Triggers != null && target.Triggers.Count > 0)
            {
                await output.WriteAsync(',');
                await output.WritePropertyName("tr");
                await output.WriteArray(target.Triggers, TriggerSerializer);
            }
        }
    }

    public class TriggerSerializer : ActivitySerializer<TriggerData>
    {
        protected override async Task SerializeInternal(TriggerData target, TextWriter output)
        {
            await output.WriteAsync(',');
            await output.WritePropertyName("_");
            await output.WriteValueString(target.UniqueTriggerKey);

            await output.WriteAsync(',');
            await output.WritePropertyName("gn");
            await output.WriteValueString(target.GroupName);

            await output.WriteAsync(',');
            await output.WritePropertyName("sd");
            await output.WriteValueNumber(target.StartDate);

            if (target.EndDate.HasValue)
            {
                await output.WriteAsync(',');
                await output.WritePropertyName("ed");
                await output.WriteValueNumber(target.EndDate.Value);
            }

            if (target.NextFireDate.HasValue)
            {
                await output.WriteAsync(',');
                await output.WritePropertyName("nfd");
                await output.WriteValueNumber(target.NextFireDate.Value);
            }

            if (target.PreviousFireDate.HasValue)
            {
                await output.WriteAsync(',');
                await output.WritePropertyName("pfd");
                await output.WriteValueNumber(target.PreviousFireDate.Value);
            }

            if (target.TriggerType != null)
            {
                await output.WriteAsync(',');
                await output.WritePropertyName("tc");
                await output.WriteValueStringEscaped(target.TriggerType.Code);

                var simpleTriggerType = target.TriggerType as SimpleTriggerType;
                if (simpleTriggerType != null)
                {
                    await output.WriteAsync(',');
                    await output.WritePropertyName("tb");
                    await output.WriteValueString(
                        simpleTriggerType.RepeatCount.ToString(CultureInfo.InvariantCulture) +
                        '|' +
                        simpleTriggerType.RepeatInterval.ToString(CultureInfo.InvariantCulture) + 
                        '|' +
                        simpleTriggerType.TimesTriggered.ToString(CultureInfo.InvariantCulture));
                }

                var cronTriggerType = target.TriggerType as CronTriggerType;
                if (cronTriggerType != null)
                {
                    await output.WriteAsync(',');
                    await output.WritePropertyName("tb");
                    await output.WriteValueString(cronTriggerType.CronExpression);
                }
            }
        }
    }
}