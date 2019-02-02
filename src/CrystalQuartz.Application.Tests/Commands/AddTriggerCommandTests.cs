namespace CrystalQuartz.Application.Tests.Commands
{
    using System;
    using System.Collections.Generic;
    using CrystalQuartz.Application.Comands;
    using CrystalQuartz.Application.Comands.Inputs;
    using CrystalQuartz.Core.Contracts;
    using CrystalQuartz.Core.Domain.ObjectInput;
    using CrystalQuartz.Core.Domain.TriggerTypes;
    using CrystalQuartz.Core.Services;
    using NSubstitute;
    using NUnit.Framework;

    [TestFixture]
    public class AddTriggerCommandTests
    {
        [Test]
        public void Execute_ValidForm_ShouldPassNames()
        {
            var mock = new SubstitutableSchedulerHost();

            var command = new AddTriggerCommand(() => mock.Value, new RegisteredInputType[0]);

            command.Execute(new AddTriggerInput
            {
                Group = "Group",
                Job = "Job",
                Name = "Trigger",
                TriggerType = "Simple"
            });

            mock.SchedulerCommander.Received().TriggerJob("Job", "Group", "Trigger", Arg.Any<TriggerType>(), Arg.Any<IDictionary<string, object>>());
        }

        [Test]
        public void Execute_SimpleTriggerWithRepeatCount_ShouldPassTriggerData()
        {
            AssertTriggerType(
                new AddTriggerInput
                {
                    TriggerType = "Simple",
                    RepeatCount = 1,
                    RepeatForever = false,
                    RepeatInterval = 3
                },
                type =>
                {
                    Assert.That(type, Is.InstanceOf<SimpleTriggerType>());

                    SimpleTriggerType simpleTriggerType = (SimpleTriggerType)type;

                    Assert.That(simpleTriggerType.RepeatCount, Is.EqualTo(1));
                    Assert.That(simpleTriggerType.RepeatInterval, Is.EqualTo(3));
                });
        }

        [Test]
        public void Execute_InfiniteSimpleTrigger_ShouldPassTriggerData()
        {
            AssertTriggerType(
                new AddTriggerInput
                {
                    TriggerType = "Simple",
                    RepeatCount = 1,
                    RepeatForever = true,
                    RepeatInterval = 3
                },
                type =>
                {
                    Assert.That(type, Is.InstanceOf<SimpleTriggerType>());

                    SimpleTriggerType simpleTriggerType = (SimpleTriggerType)type;

                    Assert.That(simpleTriggerType.RepeatCount, Is.EqualTo(-1));
                    Assert.That(simpleTriggerType.RepeatInterval, Is.EqualTo(3));
                });
        }

        [Test]
        public void Execute_CronTrigger_ShouldPassTriggerData()
        {
            AssertTriggerType(
                new AddTriggerInput
                {
                    TriggerType = "Cron",
                    CronExpression = "0 0 0 0 0 0"
                },
                type =>
                {
                    Assert.That(type, Is.InstanceOf<CronTriggerType>());

                    CronTriggerType cronTriggerType = (CronTriggerType)type;

                    Assert.That(cronTriggerType.CronExpression, Is.EqualTo("0 0 0 0 0 0"));
                });
        }

        private void AssertTriggerType(AddTriggerInput input, Action<TriggerType> assertAction)
        {
            var mock = new SubstitutableSchedulerHost();

            var command = new AddTriggerCommand(() => mock.Value, new RegisteredInputType[0]);

            command.Execute(input);

            mock.SchedulerCommander
                .Received()
                .TriggerJob(
                    Arg.Any<string>(), Arg.Any<string>(), Arg.Any<string>(),
                    Arg.Do(assertAction),
                    Arg.Any<IDictionary<string, object>>());
        }
    }

    public class SubstitutableSchedulerHost 
    {
        public SubstitutableSchedulerHost()
        {
            SchedulerCommander = Substitute.For<ISchedulerCommander>();

            Value = new SchedulerHost(
                Substitute.For<ISchedulerClerk>(),
                SchedulerCommander,
                new Version(),
                Substitute.For<ISchedulerEventHub>(),
                Substitute.For<ISchedulerEventTarget>());
        }

        public ISchedulerCommander SchedulerCommander { get; }

        public SchedulerHost Value { get; }
    }
}