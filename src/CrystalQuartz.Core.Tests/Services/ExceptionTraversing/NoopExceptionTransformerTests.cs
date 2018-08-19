namespace CrystalQuartz.Core.Tests.Services.ExceptionTraversing
{
    using System;
    using CrystalQuartz.Core.Services.ExceptionTraversing;
    using NUnit.Framework;

    [TestFixture]
    public class NoopExceptionTransformerTests
    {
        [Test]
        public void Transform_AnyException_ShouldReturnNull()
        {
            Assert.That(new NoopExceptionTransformer().Transform(new Exception()), Is.Null);
        }
    }
}