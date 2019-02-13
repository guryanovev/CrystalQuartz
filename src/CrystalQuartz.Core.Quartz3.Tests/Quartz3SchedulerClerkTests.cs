namespace CrystalQuartz.Core.Quartz3.Tests
{
    using System.Linq;
    using NUnit.Framework;
    using Quartz;
    using Quartz.Impl;

    [TestFixture]
    public class SchedulerClerkTests
    {
        [Test]
        public void GetScheduledJobTypes_HasScheduledJobs_ShouldReturnList()
        {
            var scheduler = new StdSchedulerFactory().GetScheduler().Result;

            scheduler.ScheduleJob(
                JobBuilder
                    .Create<TestJob>()
                    .Build(),
                TriggerBuilder
                    .Create()
                    .WithSimpleSchedule(s => s.WithRepeatCount(1).WithIntervalInSeconds(1)).Build());

            var clerk = new Quartz3SchedulerClerk(scheduler);

            var result = clerk.GetScheduledJobTypes().ToArray();

            Assert.That(result.Length, Is.EqualTo(1));
            Assert.That(result[0], Is.EqualTo(typeof(TestJob)));

            scheduler.Shutdown(false);
        }
    }
}