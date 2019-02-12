namespace CrystalQuartz.Application.Comands.Serialization
{
    using System.IO;
    using CrystalQuartz.Application.Comands.Outputs;

    public class JobTypesOutputSerializer : CommandResultSerializerBase<JobTypesOutput>
    {
        protected override void SerializeSuccessData(JobTypesOutput target, TextWriter output)
        {
            output.Write(',');
            output.WritePropertyName("i");
            output.WriteArray(target.AllowedTypes, CommonSerializers.TypeSerializer);
        }
    }
}