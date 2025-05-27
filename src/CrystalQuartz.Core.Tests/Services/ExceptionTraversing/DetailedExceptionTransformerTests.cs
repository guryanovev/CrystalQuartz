namespace CrystalQuartz.Core.Tests.Services.ExceptionTraversing
{
    using System;
    using CrystalQuartz.Core.Services.ExceptionTraversing;
    using NUnit.Framework;

    [TestFixture]
    public class DetailedExceptionTransformerTests
    {
        [Test]
        public void Transform_SingleException_ShouldReturnSingleMessage()
        {
            var result = new DetailedExceptionTransformer().Transform(new Exception("Message"));

            Assert.That(result, Is.Not.Null);
            Assert.That(result.Length, Is.EqualTo(1));
            Assert.That(result[0].Message, Is.EqualTo("Message"));
            Assert.That(result[0].Level, Is.EqualTo(0));
        }

        [Test]
        public void Transform_ExceptionWithInner_ShouldIncludeInner()
        {
            var result = new DetailedExceptionTransformer().Transform(new Exception("Message 1", new Exception("Message 2")));

            Assert.That(result, Is.Not.Null);
            Assert.That(result.Length, Is.EqualTo(2));
            Assert.That(result[0].Message, Is.EqualTo("Message 1"));
            Assert.That(result[0].Level, Is.EqualTo(0));
            Assert.That(result[1].Message, Is.EqualTo("Message 2"));
            Assert.That(result[1].Level, Is.EqualTo(1));
        }

        [Test]
        public void Transform_AggregateException_ShouldIncludeRootAndAllInners()
        {
            var exception = new AggregateException(
                "Root", 
                new Exception("Inner 1"), 
                new Exception("Inner 2"));

            var result = new DetailedExceptionTransformer().Transform(exception);

            Assert.That(result, Is.Not.Null);
            Assert.That(result.Length, Is.EqualTo(3));

            Assert.That(result[0].Message, Is.EqualTo("Root (Inner 1) (Inner 2)"));
            Assert.That(result[0].Level, Is.EqualTo(0));

            Assert.That(result[1].Message, Is.EqualTo("Inner 1"));
            Assert.That(result[1].Level, Is.EqualTo(1));

            Assert.That(result[2].Message, Is.EqualTo("Inner 2"));
            Assert.That(result[2].Level, Is.EqualTo(1));
        }
    }
}