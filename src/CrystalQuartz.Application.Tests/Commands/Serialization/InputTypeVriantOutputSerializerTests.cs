namespace CrystalQuartz.Application.Tests.Commands.Serialization
{
    using System.Collections.Generic;
    using System.Linq;
    using Application.Commands.Outputs;
    using Application.Commands.Serialization;
    using CrystalQuartz.Core.Domain.ObjectInput;
    using NUnit.Framework;

    [TestFixture]
    public class InputTypeVriantOutputSerializerTests : SerializerTestsBase<InputTypeVariantsOutput, InputTypeVariantOutputSerializer>
    {
        [Test]
        public void Serialize()
        {
            dynamic result = SerializeAndParse(new InputTypeVariantsOutput
            {
                Success = true,
                Items = new[]
                {
                    new InputVariant("value1", "Value 1"), 
                    new InputVariant("value2", "Value 2")
                }
            });

            dynamic i = result.i;

            Assert.That(i, Is.Not.Null);

            dynamic[] items = (i as IEnumerable<dynamic>).ToArray();

            Assert.That(items.Length, Is.EqualTo(2));
            Assert.That((string) items[0]["_"], Is.EqualTo("value1"));
            Assert.That((string) items[0]["l"], Is.EqualTo("Value 1"));

            Assert.That((string) items[1]["_"], Is.EqualTo("value2"));
            Assert.That((string) items[1]["l"], Is.EqualTo("Value 2"));
        }
    }
}