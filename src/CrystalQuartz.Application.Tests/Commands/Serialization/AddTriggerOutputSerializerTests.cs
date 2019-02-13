namespace CrystalQuartz.Application.Tests.Commands.Serialization
{
    using System.Collections.Generic;
    using CrystalQuartz.Application.Comands.Outputs;
    using CrystalQuartz.Application.Comands.Serialization;
    using NUnit.Framework;

    [TestFixture]
    public class AddTriggerOutputSerializerTests : SerializerTestsBase<AddTriggerOutput, AddTriggerOutputSerializer>
    {
        [Test]
        public void Serialize_ValidationErrors()
        {
            dynamic result = SerializeAndParse(new AddTriggerOutput
            {
                Success = true,
                ValidationErrors = new Dictionary<string, string>
                {
                    { "Field1", "Issue1" },
                    { "Field2", "Issue2" }
                }
            });

            dynamic ve = result.ve;

            Assert.That(ve, Is.Not.Null);
            Assert.That((string) ve.Field1, Is.EqualTo("Issue1"));
            Assert.That((string) ve.Field2, Is.EqualTo("Issue2"));
        }
    }
}