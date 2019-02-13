namespace CrystalQuartz.Application.Tests.Commands
{
    using CrystalQuartz.Application.Comands;
    using CrystalQuartz.Application.Comands.Inputs;
    using CrystalQuartz.Application.Comands.Outputs;
    using CrystalQuartz.Application.Tests.Stubs;
    using NUnit.Framework;

    [TestFixture]
    public class GetAllowedJobTypesCommandTests
    {
        [Test]
        public void Execute_HasAllowedJobTypes_ShouldReturnAllowedJobTypes()
        {
            var stub = new SchedulerHostStub();

            var result = (JobTypesOutput) new GetAllowedJobTypesCommand(() => stub.Value, new[]{ typeof(string) }).Execute(new NoInput());

            result.AssertSuccessfull();

            Assert.That(result.AllowedTypes, Is.Not.Null);
            Assert.That(result.AllowedTypes.Length, Is.EqualTo(1));
            Assert.That(result.AllowedTypes[0], Is.EqualTo(typeof(string)));
        }

        [Test]
        public void Execute_HasAllowedJobTypesAndScheduledJobTypes_ShouldMergeJobTypes()
        {
            var stub = new SchedulerHostStub(
                new GroupStub("Default",
                    new JobStub("Job1", typeof(int)),
                    new JobStub("Job2", typeof(long))));

            var result = (JobTypesOutput) new GetAllowedJobTypesCommand(() => stub.Value, new[]{ typeof(string) }).Execute(new NoInput());

            result.AssertSuccessfull();

            Assert.That(result.AllowedTypes, Is.Not.Null);
            Assert.That(result.AllowedTypes.Length, Is.EqualTo(3));
            Assert.That(result.AllowedTypes, Contains.Item(typeof(int)));
            Assert.That(result.AllowedTypes, Contains.Item(typeof(long)));
            Assert.That(result.AllowedTypes, Contains.Item(typeof(string)));
        }
    }
}