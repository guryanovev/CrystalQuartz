namespace CrystalQuartz.Application.Tests.Commands.Serialization
{
    using System.Collections.Generic;
    using System.Linq;
    using Application.Commands.Outputs;
    using Application.Commands.Serialization;
    using NUnit.Framework;

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
            Assert.That((string)items[0], Is.EqualTo("System.Private.CoreLib|System|Int32"));
            Assert.That((string)items[1], Is.EqualTo("System.Private.CoreLib|System|String"));
        }
    }
}