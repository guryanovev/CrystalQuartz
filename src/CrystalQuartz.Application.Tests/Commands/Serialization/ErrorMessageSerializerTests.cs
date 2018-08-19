namespace CrystalQuartz.Application.Tests.Commands.Serialization
{
    using CrystalQuartz.Application.Comands.Serialization;
    using CrystalQuartz.Core.Domain.Base;

    using NUnit.Framework;

    [TestFixture]
    public class ErrorMessageSerializerTests : SerializerTestsBase<ErrorMessage, ErrorMessageSerializer>
    {
        [Test]
        public void Serialize_WithMessageAndLevel()
        {
            dynamic result = SerializeAndParse(new ErrorMessage("error text", 3));

            Assert.That((string) result["_"], Is.EqualTo("error text"));
            Assert.That((int) result["l"], Is.EqualTo(3));
        }
    }
}