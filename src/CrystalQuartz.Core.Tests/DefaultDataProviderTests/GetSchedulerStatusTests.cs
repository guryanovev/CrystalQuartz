using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Threading.Tasks;

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
            IReadOnlyCollection<string> readOnlyList = (new List<string> {"DEFAULT"}).AsReadOnly();
            _scheduler.Expect(s => s.GetJobGroupNames()).Return(Task.FromResult(readOnlyList)).Repeat.Any();

            Verify(() =>
                   Assert
                       .That(_provider.GetSchedulerStatus(_scheduler).Result,
                             Is.EqualTo(SchedulerStatus.Ready)));
        }
        
        [Test]
        public void GetSchedulerStatus_SchedulerHaveNoJobs_ShouldReturnEmpty()
        {

            IReadOnlyCollection<string> readOnlyList = (new List<string> { }).AsReadOnly();
            _scheduler.Expect(s => s.GetJobGroupNames()).Return(Task.FromResult(readOnlyList)).Repeat.Any();

            Verify(() =>
                   Assert
                       .That(_provider.GetSchedulerStatus(_scheduler).Result,
                             Is.EqualTo(SchedulerStatus.Empty)));
        }
        
        [Test]
        public void GetSchedulerStatus_SchedulerStartedAndNotShutedDownAndJobsCreated_ShouldReturnStarted()
        {
            _scheduler.Expect(s => s.IsStarted).Return(true);
            _scheduler.Expect(s => s.IsShutdown).Return(false);
            IReadOnlyCollection<string> readOnlyList = (new List<string> { "DEFAULT" }).AsReadOnly();
            _scheduler.Expect(s => s.GetJobGroupNames()).Return(Task.FromResult(readOnlyList)).Repeat.Any();

            Verify(() =>
                   Assert
                       .That(_provider.GetSchedulerStatus(_scheduler).Result,
                             Is.EqualTo(SchedulerStatus.Started)));
        }
        
        [Test]
        public void GetSchedulerStatus_SchedulerIsShutdown_ShouldReturnShutdown()
        {
            _scheduler.Expect(s => s.IsShutdown).Return(true);

            Verify(() =>
                   Assert
                       .That(_provider.GetSchedulerStatus(_scheduler).Result,
                             Is.EqualTo(SchedulerStatus.Shutdown)));
        }
    }
}