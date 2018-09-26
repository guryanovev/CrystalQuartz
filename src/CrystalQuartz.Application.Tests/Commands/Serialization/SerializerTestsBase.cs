namespace CrystalQuartz.Application.Tests.Commands.Serialization
{
    using System.IO;
    using CrystalQuartz.WebFramework.Serialization;
    using Newtonsoft.Json.Linq;

    public class SerializerTestsBase<T, TSerializer> where TSerializer : ISerializer<T>, new()
    {
        protected dynamic SerializeAndParse(T value)
        {
            return JObject.Parse(Serialize(value));
        }

        protected string Serialize(T value)
        {
            using (var writer = new StringWriter())
            {
                new TSerializer().Serialize(value, writer);

                return writer.ToString();
            }
        }
    }
}