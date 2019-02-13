namespace CrystalQuartz.Application.Tests.Commands.Serialization
{
    using System.Collections.Generic;
    using System.Linq;
    using NUnit.Framework;
    using CrystalQuartz.Application.Comands.Outputs;
    using CrystalQuartz.Application.Comands.Serialization;

    [TestFixture]
    public class JobTypesOutputSerializerTests : SerializerTestsBase<JobTypesOutput, JobTypesOutputSerializer>
    {
        [Test]
        public void Serialize_Types()
        {
            dynamic result = SerializeAndParse(new JobTypesOutput
            {
                Success = true,
                AllowedTypes = new[]
                {
                    typeof(int),
                    typeof(string)
                }
            });

            dynamic i = result.i;

            Assert.That(i, Is.Not.Null);

            dynamic[] items = (i as IEnumerable<dynamic>).ToArray();

            Assert.That(items.Length, Is.EqualTo(2));
            Assert.That((string)items[0], Is.EqualTo("mscorlib|System|Int32"));
            Assert.That((string)items[1], Is.EqualTo("mscorlib|System|String"));
        }
    }
}