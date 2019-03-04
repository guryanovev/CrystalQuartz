namespace CrystalQuartz.Core.Tests.Services
{
    using CrystalQuartz.Core.Services;
    using CrystalQuartz.Stubs;
    using NUnit.Framework;

    [TestFixture]
    public class AllowedJobTypesRegistryTests
    {
        [Test]
        public void List_HasJobsScheduled_ShouldListJobTypes()
        {
            var result = new AllowedJobTypesRegistry(
                new[] { typeof(string) },
                new SchedulerClerkStub(
                    new GroupStub("Default",
                        new JobStub("Job1", typeof(int)),
                        new JobStub("Job2", typeof(long))))).List();

            Assert.That(result, Is.Not.Null);
            Assert.That(result.Length, Is.EqualTo(3));
            Assert.That(result, Contains.Item(typeof(int)));
            Assert.That(result, Contains.Item(typeof(long)));
            Assert.That(result, Contains.Item(typeof(string)));
        }
    }
}