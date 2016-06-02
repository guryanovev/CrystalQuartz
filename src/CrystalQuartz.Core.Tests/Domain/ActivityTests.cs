namespace CrystalQuartz.Core.Tests.Domain
{
    using Core.Domain;
    using NUnit.Framework;

    [TestFixture]
    public class ActivityTests : MockSupportTests
    {
        protected override void InternalInit()
        {
        }

        [Test]
        public void CanStart_IsActive_ShouldReturnFalse()
        {
            Assert.That(CreateActivity(ActivityStatus.Active).CanStart, Is.False);
        }

        [Test]
        public void CanStart_IsComplete_ShouldReturnFalse()
        {
            Assert.That(CreateActivity(ActivityStatus.Complete).CanStart, Is.False);
        }

        [Test]
        public void CanStart_IsMixed_ShouldReturnTrue()
        {
            Assert.That(CreateActivity(ActivityStatus.Mixed).CanStart);
        }

        [Test]
        public void CanStart_IsPaused_ShouldReturnTrue()
        {
            Assert.That(CreateActivity(ActivityStatus.Paused).CanStart);
        }

        [Test]
        public void CanPause_IsActive_ShouldReturnTrue()
        {
            Assert.That(CreateActivity(ActivityStatus.Active).CanPause);
        }

        [Test]
        public void CanPause_IsComplete_ShouldReturnFalse()
        {
            Assert.That(CreateActivity(ActivityStatus.Complete).CanPause, Is.False);
        }

        [Test]
        public void CanPause_IsMixed_ShouldReturnTrue()
        {
            Assert.That(CreateActivity(ActivityStatus.Mixed).CanPause);
        }

        [Test]
        public void CanPause_IsPaused_ShouldReturnFalse()
        {
            Assert.That(CreateActivity(ActivityStatus.Paused).CanPause, Is.False);
        }

        private static Activity CreateActivity(ActivityStatus status)
        {
            return new Activity("fakeActivity", status);
        }
    }
}