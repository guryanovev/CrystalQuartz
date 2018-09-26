namespace CrystalQuartz.Core.Tests.Services.JobResultAnalysing
{
    using System;
    using System.Collections.Generic;
    using CrystalQuartz.Core.Services.JobResultAnalysing;
    using NUnit.Framework;

    [TestFixture]
    public class DictionaryJobResultAnalyserTests
    {
        [Test]
        public void Anylise_EmptyDictionary_ShouldReturnEmptyObject()
        {
            var result = new DictionaryJobResultAnalyser("Failed", "Success", "Error").Analyse(new Dictionary<string, object>());

            Assert.That(result, Is.Not.Null);
            Assert.That(result.Faulted, Is.False);
            Assert.That(result.Error, Is.Null);
        }

        [Test]
        public void Anylise_Failed_ShouldDetectFailure()
        {
            var result = new DictionaryJobResultAnalyser("Failed", null, null).Analyse(new Dictionary<string, object>
            {
                { "Failed", true }
            });

            Assert.That(result, Is.Not.Null);
            Assert.That(result.Faulted, Is.True);
        }

        [Test]
        public void Anylise_FailedNotBoolean_ShouldNotDetectFailure()
        {
            var result = new DictionaryJobResultAnalyser("Failed", null, null).Analyse(new Dictionary<string, object>
            {
                { "Failed", "YES" }
            });

            Assert.That(result, Is.Not.Null);
            Assert.That(result.Faulted, Is.False);
        }

        [Test]
        public void Anylise_Success_ShouldDetectFailure()
        {
            var result = new DictionaryJobResultAnalyser(null, "Success", null).Analyse(new Dictionary<string, object>
            {
                { "Success", false }
            });

            Assert.That(result, Is.Not.Null);
            Assert.That(result.Faulted, Is.True);
        }

        [Test]
        public void Anylise_SuccessNotBoolean_ShouldNotDetectFailure()
        {
            var result = new DictionaryJobResultAnalyser(null, "Success", null).Analyse(new Dictionary<string, object>
            {
                { "Success", "YES" }
            });

            Assert.That(result, Is.Not.Null);
            Assert.That(result.Faulted, Is.False);
        }

        [Test]
        public void Anylise_Exception_ShouldDetectException()
        {
            var exception = new Exception("");
            var result = new DictionaryJobResultAnalyser(null, null, "Exception").Analyse(new Dictionary<string, object>
            {
                { "Exception", exception }
            });

            Assert.That(result, Is.Not.Null);
            Assert.That(result.Faulted, Is.True);
            Assert.That(result.Error, Is.EqualTo(exception));
        }
    }
}