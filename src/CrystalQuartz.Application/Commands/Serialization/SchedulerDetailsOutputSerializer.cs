namespace CrystalQuartz.Application.Commands.Serialization
{
    using System;
    using System.IO;
    using System.Threading.Tasks;
    using CrystalQuartz.WebFramework.Serialization;
    using Outputs;

    public class SchedulerDetailsOutputSerializer : CommandResultSerializerBase<SchedulerDetailsOutput>
    {
        private static readonly ISerializer<Type> TypeSerializer = new TypeSerializer();

        protected override async Task SerializeSuccessData(SchedulerDetailsOutput target, TextWriter output)
        {
            if (target.SchedulerDetails != null)
            {
                if (target.SchedulerDetails.SchedulerName != null)
                {
                    await output.WriteAsync(',');
                    await output.WritePropertyName("sn");
                    await output.WriteValueString(target.SchedulerDetails.SchedulerName);
                }

                if (target.SchedulerDetails.SchedulerInstanceId != null)
                {
                    await output.WriteAsync(',');
                    await output.WritePropertyName("siid");
                    await output.WriteValueString(target.SchedulerDetails.SchedulerInstanceId);
                }

                await output.WriteAsync(',');
                await output.WritePropertyName("isr");
                await output.WriteValueNumber(target.SchedulerDetails.SchedulerRemote ? 1 : 0);

                await output.WriteAsync(',');
                await output.WritePropertyName("t");
                await TypeSerializer.Serialize(target.SchedulerDetails.SchedulerType, output);

                if (target.SchedulerDetails.Version != null)
                {
                    await output.WriteAsync(',');
                    await output.WritePropertyName("v");
                    await output.WriteValueString(target.SchedulerDetails.Version);
                }

                await output.WriteAsync(',');
                await output.WritePropertyName("ism");
                await output.WriteValueNumber(target.SchedulerDetails.InStandbyMode ? 1 : 0);

                await output.WriteAsync(',');
                await output.WritePropertyName("isd");
                await output.WriteValueNumber(target.SchedulerDetails.Shutdown ? 1 : 0);

                await output.WriteAsync(',');
                await output.WritePropertyName("ist");
                await output.WriteValueNumber(target.SchedulerDetails.Started ? 1 : 0);

                await output.WriteAsync(',');
                await output.WritePropertyName("je");
                await output.WriteValueNumber(target.SchedulerDetails.NumberOfJobsExecuted);

                if (target.SchedulerDetails.RunningSince.HasValue)
                {
                    await output.WriteAsync(',');
                    await output.WritePropertyName("rs");
                    await output.WriteValueNumber(target.SchedulerDetails.RunningSince.Value);
                }

                await output.WriteAsync(',');
                await output.WritePropertyName("jsc");
                await output.WriteValueNumber(target.SchedulerDetails.JobStoreClustered ? 1 : 0);

                await output.WriteAsync(',');
                await output.WritePropertyName("jsp");
                await output.WriteValueNumber(target.SchedulerDetails.JobStoreSupportsPersistence? 1 : 0);

                await output.WriteAsync(',');
                await output.WritePropertyName("jst");
                await TypeSerializer.Serialize(target.SchedulerDetails.JobStoreType, output);

                await output.WriteAsync(',');
                await output.WritePropertyName("tps");
                await output.WriteValueNumber(target.SchedulerDetails.ThreadPoolSize);

                await output.WriteAsync(',');
                await output.WritePropertyName("tpt");
                await TypeSerializer.Serialize(target.SchedulerDetails.ThreadPoolType, output);
            }
        }
    }
}