using System;
using System.Collections.Generic;
using System.Linq.Expressions;
using System.Reflection;
using System.Text.RegularExpressions;
using CrystalQuartz.WebFramework.Routing;
using NUnit.Framework;
using NUnit.Framework.SyntaxHelpers;

namespace CrystalQuartz.WebFramework.Tests.Routing
{
    [TestFixture]
    public class DefaultUrlParserTests
    {
        public delegate double MyDelegate(params int[] arguments);

        [Test]
        public void ExprTest()
        {
            object y = new {jobName = "another value"};

            var r = Do(new { jobName = "" }, x_1 => x_1.jobName.Length * 3.142);
            r.GetType().GetMethod("Invoke").Invoke(r, new[] {y});
        }

        private Action<T> Do<T>(T t, Func<T, double> p)
        {
            return null;
        }

        [Test]
        public void Parse_NotMatchingUrl_ShouldReturnNotMatchingData()
        {
            IUrlParser parser = new DefaultUrlParser();
            var data = parser.Parse("jobs/backup/restart", "jobs/{jobCode}/stop");

            Assert.That(data.MatchingUrl, Is.False);
        }

        [Test]
        public void Parse_UrlWithSingleParameter_ShouldReturnMatchingData()
        {
            IUrlParser parser = new DefaultUrlParser();
            var data = parser.Parse("jobs/backup/restart", "jobs/{jobCode}/restart");

            Assert.That(data.MatchingUrl);
            Assert.That(data.Parameters, Is.Not.Null);
            Assert.That(data.Parameters.ContainsKey("jobCode"));
            Assert.That(data.Parameters["jobCode"], Is.EqualTo("backup"));
        }

        [Test]
        public void Parse_UrlWithMultipleParameters_ShouldReturnMatchingData()
        {
            IUrlParser parser = new DefaultUrlParser();
            var data = parser.Parse("jobs/backup/restart", "jobs/{jobCode}/{jobAction}");

            Assert.That(data.MatchingUrl);
            Assert.That(data.Parameters, Is.Not.Null);
            Assert.That(data.Parameters.ContainsKey("jobCode"));
            Assert.That(data.Parameters["jobCode"], Is.EqualTo("backup"));
            Assert.That(data.Parameters.ContainsKey("jobAction"));
            Assert.That(data.Parameters["jobAction"], Is.EqualTo("restart"));
        }
    }
}