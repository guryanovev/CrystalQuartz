using System.IO;
using CrystalQuartz.Application.Comands.Outputs;
using CrystalQuartz.Core.Domain;

namespace CrystalQuartz.Application.Comands.Serialization
{
    using System.Threading.Tasks;

    public class JobDetailsOutputSerializer : CommandResultSerializerBase<JobDetailsOutput>
    {
        protected override async Task SerializeSuccessData(JobDetailsOutput target, TextWriter output)
        {
            JobDetails details = target.JobDetails;
            if (details != null)
            {
                await output.WriteAsync(',');
                await output.WritePropertyName("jd");
                await output.WriteAsync('{');

                await output.WritePropertyName("ced");
                await output.WriteValueNumber(details.ConcurrentExecutionDisallowed ? 1 : 0);

                await output.WriteAsync(',');
                await output.WritePropertyName("pjd");
                await output.WriteValueNumber(details.PersistJobDataAfterExecution ? 1 : 0);

                await output.WriteAsync(',');
                await output.WritePropertyName("rr");
                await output.WriteValueNumber(details.RequestsRecovery ? 1 : 0);

                await output.WriteAsync(',');
                await output.WritePropertyName("d");
                await output.WriteValueNumber(details.Durable ? 1 : 0);

                await output.WriteAsync(',');
                await output.WritePropertyName("t");
                await CommonSerializers.TypeSerializer.Serialize(details.JobType, output);

                if (details.Description != null)
                {
                    await output.WriteAsync(',');
                    await output.WritePropertyName("ds");
                    await output.WriteValueString(details.Description);
                }

                await output.WriteAsync('}');
            }

            if (target.JobDataMap != null)
            {
                await output.WriteAsync(',');
                await output.WritePropertyName("jdm");
                await CommonSerializers.PropertySerializer.Serialize(target.JobDataMap, output);
            }
        }
    }
}