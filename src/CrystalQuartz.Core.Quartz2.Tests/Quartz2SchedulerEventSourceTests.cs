﻿namespace CrystalQuartz.Core.Quartz2.Tests
{
    using System;
    using CrystalQuartz.Core.Domain.Events;
    using CrystalQuartz.Core.Quartz2.Tests.Stubs;
    using NUnit.Framework;
    using Quartz;

    [TestFixture]
    public class Quartz2SchedulerEventSourceTests
    {
        [Test]
        public void TriggerFired_ShouldEmitEvent()
        {
            const string fireInstanceId = "fire-42";
            const string triggerKey = "fire-42";

            var emitted = ExecuteAndGetEvent(
                new Quartz2SchedulerEventSource(true),
                eventSource =>
                {
                    var trigger = new TriggerStub(triggerKey);
                    eventSource.TriggerFired(
                        trigger,
                        new JobExecutionContextStub
                        {
                            FireInstanceId = fireInstanceId,
                            Trigger = trigger
                        });
                });

            Assert.That(emitted, Is.Not.Null);
            Assert.That(emitted.Error, Is.Null);
            Assert.That(emitted.EventType, Is.EqualTo(SchedulerEventType.Fired));
            Assert.That(emitted.FireInstanceId, Is.EqualTo(fireInstanceId));
            Assert.That(emitted.ItemKey, Is.EqualTo("DEFAULT." + triggerKey));
            Assert.That(emitted.Scope, Is.EqualTo(SchedulerEventScope.Trigger));
        }

        [Test]
        public void TriggerComplete_ListenToTriggers_ShouldPassJobResult()
        {
            var result = new object();
            var emitted = ExecuteAndGetEvent(
                new Quartz2SchedulerEventSource(false),
                eventSource =>
                {
                    var trigger = new TriggerStub("any");
                    eventSource.TriggerComplete(
                        trigger,
                        new JobExecutionContextStub
                        {
                            Trigger = trigger,
                            Result = result
                        },
                        SchedulerInstruction.SetTriggerComplete);
                });

            Assert.That(emitted, Is.Not.Null);
            Assert.That(emitted.RawJobResult, Is.EqualTo(result));
        }

        [Test]
        public void TriggerComplete_ListenToTriggers_ShouldEmitEvent()
        {
            const string fireInstanceId = "fire-42";
            const string triggerKey = "fire-42";

            var emitted = ExecuteAndGetEvent(
                new Quartz2SchedulerEventSource(false),
                eventSource =>
                {
                    var trigger = new TriggerStub(triggerKey);
                    eventSource.TriggerComplete(
                        trigger,
                        new JobExecutionContextStub
                        {
                            FireInstanceId = fireInstanceId,
                            Trigger = trigger
                        },
                        SchedulerInstruction.SetTriggerComplete);
                });

            Assert.That(emitted, Is.Not.Null);
            Assert.That(emitted.Error, Is.Null);
            Assert.That(emitted.EventType, Is.EqualTo(SchedulerEventType.Complete));
            Assert.That(emitted.FireInstanceId, Is.EqualTo(fireInstanceId));
            Assert.That(emitted.ItemKey, Is.EqualTo("DEFAULT." + triggerKey));
            Assert.That(emitted.Scope, Is.EqualTo(SchedulerEventScope.Trigger));
        }

        [Test]
        public void TriggerComplete_ListenToJobs_ShouldNotEmitEvent()
        {
            var emitted = ExecuteAndGetEvent(
                new Quartz2SchedulerEventSource(true),
                eventSource =>
                {
                    var trigger = new TriggerStub("any");
                    eventSource.TriggerComplete(
                        trigger,
                        new JobExecutionContextStub
                        {
                            Trigger = trigger
                        },
                        SchedulerInstruction.SetTriggerComplete);
                });

            Assert.That(emitted, Is.Null);
        }

        [Test]
        public void JobWasExecuted_ListenToTriggers_ShouldNotEmitEvent()
        {
            var emitted = ExecuteAndGetEvent(
                new Quartz2SchedulerEventSource(false),
                eventSource =>
                {
                    var trigger = new TriggerStub("any");
                    eventSource.JobWasExecuted(
                        new JobExecutionContextStub
                        {
                            Trigger = trigger
                        },
                        null);
                });

            Assert.That(emitted, Is.Null);
        }

        [Test]
        public void JobWasExecuted_ListenToJobs_ShouldEmitEvent()
        {
            const string fireInstanceId = "fire-42";
            const string triggerKey = "fire-42";

            var emitted = ExecuteAndGetEvent(
                new Quartz2SchedulerEventSource(true),
                eventSource =>
                {
                    var trigger = new TriggerStub(triggerKey);
                    eventSource.JobWasExecuted(
                        new JobExecutionContextStub
                        {
                            Trigger = trigger,
                            FireInstanceId = fireInstanceId
                        },
                        null);
                });

            Assert.That(emitted, Is.Not.Null);
            Assert.That(emitted.Error, Is.Null);
            Assert.That(emitted.EventType, Is.EqualTo(SchedulerEventType.Complete));
            Assert.That(emitted.FireInstanceId, Is.EqualTo(fireInstanceId));
            Assert.That(emitted.ItemKey, Is.EqualTo("DEFAULT." + triggerKey));
            Assert.That(emitted.Scope, Is.EqualTo(SchedulerEventScope.Trigger));
        }

        [Test]
        public void JobWasExecuted_ListenToJobs_ShouldPassException()
        {
            var emitted = ExecuteAndGetEvent(
                new Quartz2SchedulerEventSource(true),
                eventSource =>
                {
                    var trigger = new TriggerStub("any");
                    eventSource.JobWasExecuted(
                        new JobExecutionContextStub
                        {
                            Trigger = trigger
                        },
                        new JobExecutionException("Error"));
                });

            Assert.That(emitted, Is.Not.Null);
            Assert.That(emitted.Error, Is.Not.Null);
            Assert.That(emitted.Error.Message, Is.EqualTo("Error"));
        }

        [Test]
        public void JobWasExecuted_ListenToJobs_ShouldPassJobResult()
        {
            var result = new object();
            var emitted = ExecuteAndGetEvent(
                new Quartz2SchedulerEventSource(true),
                eventSource =>
                {
                    var trigger = new TriggerStub("any");
                    eventSource.JobWasExecuted(
                        new JobExecutionContextStub
                        {
                            Trigger = trigger,
                            Result = result
                        },
                        null);
                });

            Assert.That(emitted, Is.Not.Null);
            Assert.That(emitted.RawJobResult, Is.EqualTo(result));
        }

        [Test]
        public void JobWasExecuted_ListenToJobs_ShouldUnwrapJobExecutionExceptionAndSchedulerException()
        {
            var emitted = ExecuteAndGetEvent(
                new Quartz2SchedulerEventSource(true),
                eventSource =>
                {
                    var trigger = new TriggerStub("any");
                    eventSource.JobWasExecuted(
                        new JobExecutionContextStub
                        {
                            Trigger = trigger
                        },
                        new JobExecutionException("Error", new SchedulerException("Error", new Exception("Inner Exception Error"))));
                });

            Assert.That(emitted, Is.Not.Null);
            Assert.That(emitted!.Error, Is.Not.Null);
            Assert.That(emitted.Error!.Message, Is.EqualTo("Inner Exception Error"));
        }

        private RawSchedulerEvent? ExecuteAndGetEvent(Quartz2SchedulerEventSource source, Action<Quartz2SchedulerEventSource> action)
        {
            RawSchedulerEvent? result = null;

            source.EventEmitted += (sender, args) => { result = args.Payload; };

            action.Invoke(source);

            return result;
        }
    }
}