namespace CrystalQuartz.Core.Tests.Domain.ObjectInput
{
    using System;
    using System.Globalization;
    using CrystalQuartz.Core.Domain.ObjectInput;
    using NUnit.Framework;

    [TestFixture]
    public class StandardInputTypeConverterTests
    {
        [Test]
        public void Convert_Int_ShouldConvert()
        {
            var converter = new StandardInputTypeConverter(CultureInfo.InvariantCulture, TypeCode.Int32);

            Assert.That(converter.Convert("42"), Is.EqualTo(42));
        }

        [Test]
        public void Convert_Long_ShouldConvert()
        {
            var converter = new StandardInputTypeConverter(CultureInfo.InvariantCulture, TypeCode.Int64);

            Assert.That(converter.Convert("42"), Is.EqualTo(42L));
        }
    }
}