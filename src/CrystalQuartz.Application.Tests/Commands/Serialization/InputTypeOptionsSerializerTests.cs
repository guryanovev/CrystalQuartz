namespace CrystalQuartz.Application.Tests.Commands.Serialization
{
    using System.Collections.Generic;
    using System.Linq;
    using CrystalQuartz.Application.Comands.Outputs;
    using CrystalQuartz.Application.Comands.Serialization;
    using NUnit.Framework;

    [TestFixture]
    public class InputTypeOptionsSerializerTests : SerializerTestsBase<InputTypesOutput, InputTypeOptionsSerializer>
    {
        [Test]
        public void Serialize()
        {
            dynamic result = SerializeAndParse(new InputTypesOutput
            {
                Success = true,
                Items = new[]
                {
                    new InputTypeItem {Code = "inputType1", Label = "Input Type 1"},
                    new InputTypeItem {Code = "inputType2", Label = "Input Type 2", HasVariants = true}
                }
            });

            dynamic i = result["i"];

            Assert.That(i, Is.Not.Null);

            dynamic[] items = (i as IEnumerable<dynamic>).ToArray();

            Assert.That(items.Length, Is.EqualTo(2));
            Assert.That((string) items[0]["_"], Is.EqualTo("inputType1"));
            Assert.That((string) items[0]["l"], Is.EqualTo("Input Type 1"));
            Assert.That((bool?) items[0]["v"], Is.False);

            Assert.That((string) items[1]["_"], Is.EqualTo("inputType2"));
            Assert.That((string) items[1]["l"], Is.EqualTo("Input Type 2"));
            Assert.That((bool?) items[1]["v"], Is.True);
        }
    }
}