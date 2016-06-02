namespace CrystalQuartz.Core.Tests.Domain
{
    using Core.Domain;
    using NUnit.Framework;

    [TestFixture]
    public class SchedulerDataTests 
    {
        [Test]
        public void CanStart_NotStarted_ShouldReturnTrue()
        {
            Assert.That(new SchedulerData{Status = SchedulerStatus.Ready}.CanStart);
        }

        [Test]
        public void CanStart_AlreadyStarted_ShouldReturnFalse()
        {
            Assert.That(new SchedulerData{Status = SchedulerStatus.Empty}.CanStart, Is.False);
            Assert.That(new SchedulerData{Status = SchedulerStatus.Shutdown}.CanStart, Is.False);
            Assert.That(new SchedulerData{Status = SchedulerStatus.Started}.CanStart, Is.False);
        }

        [Test]
        public void CanShutdown_IsShutdown_ShouldReturnFalse()
        {
            Assert.That(new SchedulerData { Status = SchedulerStatus.Shutdown }.CanShutdown, Is.False);
        }

        [Test]
        public void CanShutdown_NotShutdown_ShouldReturnTrue()
        {
            Assert.That(new SchedulerData { Status = SchedulerStatus.Empty }.CanShutdown);
            Assert.That(new SchedulerData { Status = SchedulerStatus.Ready }.CanShutdown);
            Assert.That(new SchedulerData { Status = SchedulerStatus.Started }.CanShutdown);
        }
    }
}