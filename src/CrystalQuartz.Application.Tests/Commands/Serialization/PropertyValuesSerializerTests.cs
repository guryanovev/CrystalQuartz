namespace CrystalQuartz.Application.Tests.Commands.Serialization
{
    using System.Collections.Generic;
    using System.Linq;
    using CrystalQuartz.Application.Comands.Serialization;
    using CrystalQuartz.Core.Domain.ObjectTraversing;
    using NUnit.Framework;

    [TestFixture]
    public class PropertyValuesSerializerTests : SerializerTestsBase<PropertyValue, PropertyValueSerializer>
    {
        [Test]
        public void Serialize_Null()
        {
            Assert.That(Serialize(null), Is.EqualTo("null"));
        }

        [Test]
        public void Serialize_Error()
        {
            dynamic result = SerializeAndParse(new ErrorPropertyValue("Error message"));

            Assert.That((string) result["_"], Is.EqualTo("error"));
            Assert.That((string) result["_err"], Is.EqualTo("Error message"));
        }

        [Test]
        public void Serialize_Ellipsis()
        {
            dynamic result = SerializeAndParse(new EllipsisPropertyValue());

            Assert.That((string) result["_"], Is.EqualTo("..."));
        }

        [Test]
        public void Serialize_SingleValue()
        {
            dynamic result = SerializeAndParse(new SinglePropertyValue(typeof(string), "testValue", SingleValueKind.String));

            Assert.That(result["_err"], Is.Null);

            Assert.That((string) result["_"], Is.EqualTo("single"));
            Assert.That((string) result["v"], Is.EqualTo("testValue"));
        }

        [Test]
        public void Serialize_Enumerable()
        {
            dynamic result = SerializeAndParse(new EnumerablePropertyValue(
                typeof(string), 
                new PropertyValue[]
                {
                    new SinglePropertyValue(typeof(string), "1", SingleValueKind.String)
                },
                false));

            Assert.That((string) result["_"], Is.EqualTo("enumerable"));
            Assert.That(result.v, Is.Not.Null);

            dynamic[] items = ((IEnumerable<dynamic>) result.v).ToArray();

            Assert.That(items.Length, Is.EqualTo(1));
        }

        [Test]
        public void Serialize_EnumerableWithOverwlow_ShouldMarkOverflow()
        {
            dynamic result = SerializeAndParse(new EnumerablePropertyValue(
                typeof(string), 
                new PropertyValue[0],
                true));

            Assert.That(result["..."], Is.Not.Null);
            Assert.That((int) result["..."], Is.EqualTo(1));
        }

        [Test]
        public void Serialize_ObjectValue_ShouldSerializeProperties()
        {
            dynamic result = SerializeAndParse(new ObjectPropertyValue(
                typeof(string), 
                new[]
                {
                    new Property("Prop1", null), 
                    new Property("Prop2", null), 
                },
                false));

            Assert.That((string)result["_"], Is.EqualTo("object"));
            Assert.That(result.v, Is.Not.Null);
            Assert.That(result.v.Prop1, Is.Not.Null);
            Assert.That(result.v.Prop2, Is.Not.Null);
        }

        [Test]
        public void Serialize_ObjectValueWithOverflow_ShouldMarkOverflow()
        {
            dynamic result = SerializeAndParse(new ObjectPropertyValue(
                typeof(string), 
                new Property[0],
                true));

            Assert.That((int) result["..."], Is.EqualTo(1));
        }
    }
}