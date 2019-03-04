namespace CrystalQuartz.Application.Tests.Commands
{
    using CrystalQuartz.Application.Comands;
    using CrystalQuartz.Application.Comands.Inputs;
    using CrystalQuartz.Application.Comands.Outputs;
    using CrystalQuartz.Application.Tests.Stubs;
    using CrystalQuartz.Stubs;
    using NUnit.Framework;

    [TestFixture]
    public class GetAllowedJobTypesCommandTests
    {
        [Test]
        public void Execute_HasAllowedJobTypes_ShouldReturnAllowedJobTypes()
        {
            var stub = new SchedulerHostStub(new[] { typeof(string) });

            var result = (JobTypesOutput) new GetAllowedJobTypesCommand(() => stub.Value).Execute(new NoInput());

            result.AssertSuccessfull();

            Assert.That(result.AllowedTypes, Is.Not.Null);
            Assert.That(result.AllowedTypes.Length, Is.EqualTo(1));
            Assert.That(result.AllowedTypes[0], Is.EqualTo(typeof(string)));
        }
    }
}