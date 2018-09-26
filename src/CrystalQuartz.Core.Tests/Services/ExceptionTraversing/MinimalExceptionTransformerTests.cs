namespace CrystalQuartz.Core.Tests.Services.ExceptionTraversing
{
    using System;
    using CrystalQuartz.Core.Domain.Base;
    using CrystalQuartz.Core.Services.ExceptionTraversing;
    using NUnit.Framework;

    [TestFixture]
    public class MinimalExceptionTransformerTests
    {
        [Test]
        public void Transform_Exception_ShouldReturnSingleMessage()
        {
            var result = Transform(new Exception("Message text"));

            Assert.That(result.Length, Is.EqualTo(1));
            Assert.That(result[0].Message, Is.EqualTo("Message text"));
            Assert.That(result[0].Level, Is.EqualTo(0));
        }

        [Test]
        public void Transform_ExceptionWithInner_ShouldReturnSingleMessage()
        {
            var result = Transform(new Exception("Message text", new Exception("Inner 1")));

            Assert.That(result.Length, Is.EqualTo(1));
            Assert.That(result[0].Message, Is.EqualTo("Message text"));
            Assert.That(result[0].Level, Is.EqualTo(0));
        }

        [Test]
        public void Transform_AggregateException_ShouldUnwrap()
        {
            var result = Transform(new AggregateException("Root message", new Exception[]
            {
                new Exception("Inner 1"),
                new Exception("Inner 2")
            }));

            Assert.That(result.Length, Is.EqualTo(1));
            Assert.That(result[0].Message, Is.EqualTo("Inner 1"));
            Assert.That(result[0].Level, Is.EqualTo(0));
        }

        [Test]
        public void Transform_MessageTextOverflow_ShouldTruncateMessageText()
        {
            var result = Transform(new Exception("123456"), 5);

            Assert.That(result.Length, Is.EqualTo(1));
            Assert.That(result[0].Message, Is.EqualTo("12345..."));
        }

        private ErrorMessage[] Transform(Exception exception, int messageLengthLimit = int.MaxValue)
        {
            return new MinimalExceptionTransformer(messageLengthLimit).Transform(exception);
        }
    }
}