namespace CrystalQuartz.Application.Comands.Serialization
{
    using System.IO;
    using System.Threading.Tasks;
    using CrystalQuartz.Application.Comands.Outputs;

    public class JobTypesOutputSerializer : CommandResultSerializerBase<JobTypesOutput>
    {
        protected override async Task SerializeSuccessData(JobTypesOutput target, TextWriter output)
        {
            await output.WriteAsync(',');
            await output.WritePropertyName("i");
            await output.WriteArray(target.AllowedTypes, CommonSerializers.TypeSerializer);
        }
    }
}