namespace CrystalQuartz.Core.Tests.Utils
{
    using System;
    using CrystalQuartz.Core.Utils;
    using NUnit.Framework;

    [TestFixture]
    public class ExceptionUtilsTests
    {
        [Test]
        public void Unwrap_NothingToUnwrap_ShouldReturnOriginalException()
        {
            var original = new Exception("ex");
            var unwrapped = original.Unwrap<ArgumentException>();

            Assert.That(unwrapped, Is.EqualTo(original));
        }

        [Test]
        public void Unwrap_Null_ShouldReturnNull()
        {
            Exception ex = null;

            Assert.That(ex.Unwrap<ArgumentException>(), Is.Null);
        }

        [Test]
        public void Unwrap_FirstLevelWrapper_ShouldUnwrap()
        {
            var original = new Exception("ex");
            var wrapped = new WrapperException(original);
            var unwrapped = wrapped.Unwrap<WrapperException>();

            Assert.That(unwrapped, Is.EqualTo(original));
        }

        [Test]
        public void Unwrap_MultiLevelWrapper_ShouldUnwrap()
        {
            var original = new Exception("ex");
            var wrapped = new WrapperException(new WrapperException(original));
            var unwrapped = wrapped.Unwrap<WrapperException>();

            Assert.That(unwrapped, Is.EqualTo(original));
        }
    }

    internal class WrapperException : Exception
    {
        public WrapperException(Exception innerException) : base("none", innerException)
        {
        }
    }
}