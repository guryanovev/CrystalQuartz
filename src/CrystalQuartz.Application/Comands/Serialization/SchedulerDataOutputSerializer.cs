namespace CrystalQuartz.Application.Comands.Serialization
{
    using System.IO;
    using System.Threading.Tasks;
    using CrystalQuartz.Application.Comands.Outputs;

    public class SchedulerDataOutputSerializer : CommandResultSerializerBase<SchedulerDataOutput>
    {
        protected override async Task SerializeSuccessData(SchedulerDataOutput target, TextWriter output)
        {
            await output.WriteAsync(',');
            await output.WritePropertyName("n");
            await output.WriteValueString(target.Name);

            await output.WriteAsync(',');
            await output.WritePropertyName("_");
            await output.WriteValueString(target.InstanceId);

            await output.WriteAsync(',');
            await output.WritePropertyName("sim");
            await output.WriteValueNumber(target.ServerInstanceMarker);

            await output.WriteAsync(',');
            await output.WritePropertyName("st");
            await output.WriteValueString(target.Status);

            await output.WriteAsync(',');
            await output.WritePropertyName("jt");
            await output.WriteValueNumber(target.JobsTotal);

            await output.WriteAsync(',');
            await output.WritePropertyName("je");
            await output.WriteValueNumber(target.JobsExecuted);

            if (target.RunningSince.HasValue)
            {
                await output.WriteAsync(',');
                await output.WritePropertyName("rs");
                await output.WriteValueNumber(target.RunningSince.Value);
            }

            /* Events */
            if (target.Events != null && target.Events.Length > 0)
            {
                await output.WriteAsync(',');
                await output.WritePropertyName("ev");
                await output.WriteArray(target.Events, new SchedulerEventSerializer());
            }

            if (target.InProgress != null && target.InProgress.Length > 0)
            {
                await output.WriteAsync(',');
                await output.WritePropertyName("ip");
                await output.WriteAsync('[');
                for (var i = 0; i < target.InProgress.Length; i++)
                {
                    if (i > 0)
                    {
                        await output.WriteAsync(',');
                    }

                    var executingJobInfo = target.InProgress[i];
                    await output.WriteValueString(executingJobInfo.FireInstanceId + "|" + executingJobInfo.UniqueTriggerKey);
                }

                await output.WriteAsync(']');
            }

            if (target.JobGroups != null && target.JobGroups.Length > 0)
            {
                await output.WriteAsync(',');
                await output.WritePropertyName("jg");
                await output.WriteArray(target.JobGroups, new JobGroupSerializer());
            }
        }
    }
}