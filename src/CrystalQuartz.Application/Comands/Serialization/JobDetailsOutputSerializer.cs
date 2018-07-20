using System.IO;
using CrystalQuartz.Application.Comands.Outputs;
using CrystalQuartz.Core.Domain;

namespace CrystalQuartz.Application.Comands.Serialization
{
    public class JobDetailsOutputSerializer : CommandResultSerializerBase<JobDetailsOutput>
    {
        protected override void SerializeSuccessData(JobDetailsOutput target, StreamWriter output)
        {
            JobDetails details = target.JobDetails;
            if (details != null)
            {
                output.Write(',');
                output.WritePropertyName("jd");
                output.Write('{');

                output.WritePropertyName("ced");
                output.WriteValueNumber(details.ConcurrentExecutionDisallowed ? 1 : 0);

                output.Write(',');
                output.WritePropertyName("pjd");
                output.WriteValueNumber(details.PersistJobDataAfterExecution ? 1 : 0);

                output.Write(',');
                output.WritePropertyName("rr");
                output.WriteValueNumber(details.RequestsRecovery ? 1 : 0);

                output.Write(',');
                output.WritePropertyName("d");
                output.WriteValueNumber(details.Durable ? 1 : 0);

                output.Write(',');
                output.WritePropertyName("t");
                CommonSerializers.TypeSerializer.Serialize(details.JobType, output);

                if (details.Description != null)
                {
                    output.Write(',');
                    output.WritePropertyName("ds");
                    output.WriteValueString(details.Description);
                }

                output.Write('}');
            }

            if (target.JobDataMap != null)
            {
                output.Write(',');
                output.WritePropertyName("jdm");
                output.WriteArray(target.JobDataMap, CommonSerializers.PropertySerializer);
            }
        }
    }
}