using System;
using System.Linq;
using System.Net.Sockets;
using NUnit.Framework;
using Quartz;

namespace CrystalQuartz.Core.Quartz3.Tests
{
    [TestFixture]
    public class Quartz3SchedulerEngineTests
    {
        [Test]
        public void CreateStandardRemoteScheduler_ShouldCreateSchedulerInstance()
        {
            try
            {
                var scheduler = new Quartz3SchedulerEngine().CreateStandardRemoteScheduler("tcp://localhost:555");

                Assert.That(scheduler, Is.InstanceOf<IScheduler>());
            }
            catch (AggregateException e)
            {
                var actualException = e.Flatten().InnerExceptions.First();
                if (!(actualException is SocketException))
                {
                    Assert.Fail(e.Message);
                }
            }
        }
    }
}