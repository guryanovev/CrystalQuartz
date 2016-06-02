namespace CrystalQuartz.Core.Tests.DefaultDataProviderTests
{
    using Core.Domain;
    using Domain;
    using NUnit.Framework;
    using Rhino.Mocks;

    [TestFixture]
    public class GetSchedulerStatusTests : DefaultDataProviderTestsBase
    {
        [Test]
        public void GetSchedulerStatus_SchedulerNotStarted_ShouldReturnStopped()
        {

            _scheduler.Expect(s => s.IsStarted).Return(false);
            _scheduler.Expect(s => s.GetJobGroupNames()).Return(new[] { "DEFAULT" }).Repeat.Any();

            Verify(() =>
                   Assert
                       .That(_provider.GetSchedulerStatus(_scheduler),
                             Is.EqualTo(SchedulerStatus.Ready)));
        }
        
        [Test]
        public void GetSchedulerStatus_SchedulerHaveNoJobs_ShouldReturnEmpty()
        {

            _scheduler.Expect(s => s.GetJobGroupNames()).Return(new string[]{}).Repeat.Any();

            Verify(() =>
                   Assert
                       .That(_provider.GetSchedulerStatus(_scheduler),
                             Is.EqualTo(SchedulerStatus.Empty)));
        }
        
        [Test]
        public void GetSchedulerStatus_SchedulerStartedAndNotShutedDownAndJobsCreated_ShouldReturnStarted()
        {
            _scheduler.Expect(s => s.IsStarted).Return(true);
            _scheduler.Expect(s => s.IsShutdown).Return(false);
            _scheduler.Expect(s => s.GetJobGroupNames()).Return(new[]{"DEFAULT"}).Repeat.Any();

            Verify(() =>
                   Assert
                       .That(_provider.GetSchedulerStatus(_scheduler),
                             Is.EqualTo(SchedulerStatus.Started)));
        }
        
        [Test]
        public void GetSchedulerStatus_SchedulerIsShutdown_ShouldReturnShutdown()
        {
            _scheduler.Expect(s => s.IsShutdown).Return(true);

            Verify(() =>
                   Assert
                       .That(_provider.GetSchedulerStatus(_scheduler),
                             Is.EqualTo(SchedulerStatus.Shutdown)));
        }
    }
}