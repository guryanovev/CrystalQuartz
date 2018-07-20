using System;
using System.IO;
using CrystalQuartz.Application.Comands.Outputs;
using CrystalQuartz.WebFramework.Serialization;

namespace CrystalQuartz.Application.Comands.Serialization
{
    public class SchedulerDetailsOutputSerializer : CommandResultSerializerBase<SchedulerDetailsOutput>
    {
        private static readonly ISerializer<Type> TypeSerializer = new TypeSerializer();

        protected override void SerializeSuccessData(SchedulerDetailsOutput target, StreamWriter output)
        {
            if (target.SchedulerDetails != null)
            {
                if (target.SchedulerDetails.SchedulerName != null)
                {
                    output.Write(',');
                    output.WritePropertyName("sn");
                    output.WriteValueString(target.SchedulerDetails.SchedulerName);
                }

                if (target.SchedulerDetails.SchedulerInstanceId != null)
                {
                    output.Write(',');
                    output.WritePropertyName("siid");
                    output.WriteValueString(target.SchedulerDetails.SchedulerInstanceId);
                }

                output.Write(',');
                output.WritePropertyName("isr");
                output.WriteValueNumber(target.SchedulerDetails.SchedulerRemote ? 1 : 0);

                output.Write(',');
                output.WritePropertyName("t");
                TypeSerializer.Serialize(target.SchedulerDetails.SchedulerType, output);

                if (target.SchedulerDetails.Version != null)
                {
                    output.Write(',');
                    output.WritePropertyName("v");
                    output.WriteValueString(target.SchedulerDetails.Version);
                }

                output.Write(',');
                output.WritePropertyName("ism");
                output.WriteValueNumber(target.SchedulerDetails.InStandbyMode ? 1 : 0);

                output.Write(',');
                output.WritePropertyName("isd");
                output.WriteValueNumber(target.SchedulerDetails.Shutdown ? 1 : 0);

                output.Write(',');
                output.WritePropertyName("ist");
                output.WriteValueNumber(target.SchedulerDetails.Started ? 1 : 0);

                output.Write(',');
                output.WritePropertyName("je");
                output.WriteValueNumber(target.SchedulerDetails.NumberOfJobsExecuted);

                if (target.SchedulerDetails.RunningSince.HasValue)
                {
                    output.Write(',');
                    output.WritePropertyName("rs");
                    output.WriteValueNumber(target.SchedulerDetails.RunningSince.Value);
                }

                output.Write(',');
                output.WritePropertyName("jsc");
                output.WriteValueNumber(target.SchedulerDetails.JobStoreClustered ? 1 : 0);

                output.Write(',');
                output.WritePropertyName("jsp");
                output.WriteValueNumber(target.SchedulerDetails.JobStoreSupportsPersistence? 1 : 0);

                output.Write(',');
                output.WritePropertyName("jst");
                TypeSerializer.Serialize(target.SchedulerDetails.JobStoreType, output);

                output.Write(',');
                output.WritePropertyName("tps");
                output.WriteValueNumber(target.SchedulerDetails.ThreadPoolSize);

                output.Write(',');
                output.WritePropertyName("tpt");
                TypeSerializer.Serialize(target.SchedulerDetails.ThreadPoolType, output);
            }
        }
    }
}