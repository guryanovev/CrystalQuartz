namespace CrystalQuartz.Application.Tests.Commands.Serialization
{
    using System;
    using CrystalQuartz.Application.Comands.Serialization;
    using NUnit.Framework;

    [TestFixture]
    public class TypeSerializerTests : SerializerTestsBase<Type, TypeSerializer>
    {
        [Test]
        public void NestedClass_ShouldSerializeWithParentClassName()
        {
            string result = Serialize(typeof(NestedType));

            Assert.That(
                result, 
                Is.EqualTo("\"CrystalQuartz.Application.Tests|CrystalQuartz.Application.Tests.Commands.Serialization|TypeSerializerTests+NestedType\""));
        }

        public class NestedType
        {
        }
    }
}