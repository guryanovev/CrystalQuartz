namespace CrystalQuartz.Application.Tests.Commands
{
    using System;
    using System.Collections.Generic;
    using CrystalQuartz.Application.Comands;
    using CrystalQuartz.Application.Comands.Inputs;
    using CrystalQuartz.Application.Comands.Outputs;
    using CrystalQuartz.Core.Contracts;
    using CrystalQuartz.Core.Domain.ObjectInput;
    using CrystalQuartz.Core.Domain.TriggerTypes;
    using CrystalQuartz.Core.Services;
    using NSubstitute;
    using NSubstitute.ExceptionExtensions;
    using NUnit.Framework;

    [TestFixture]
    public class AddTriggerCommandTests
    {
        [Test]
        public void Execute_ValidForm_ShouldPassNames()
        {
            var mock = new SubstitutableSchedulerHost();

            var command = new AddTriggerCommand(() => mock.Value, new RegisteredInputType[0]);

            AddTriggerOutput result = (AddTriggerOutput) command.Execute(new AddTriggerInput
            {
                Group = "Group",
                Job = "Job",
                Name = "Trigger",
                TriggerType = "Simple"
            });

            Assert.That(result.Success, "Success");

            mock.SchedulerCommander.Received().ScheduleJob("Job", "Group", "Trigger", Arg.Any<TriggerType>(), Arg.Any<IDictionary<string, object>>());
        }

        [Test]
        public void Execute_SimpleTriggerWithRepeatCount_ShouldPassTriggerData()
        {
            var result = AssertTriggerType(
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

            Assert.That(result.Success, "Success");
        }

        [Test]
        public void Execute_InfiniteSimpleTrigger_ShouldPassTriggerData()
        {
            var result = AssertTriggerType(
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

            Assert.That(result.Success, "Success");
        }

        [Test]
        public void Execute_CronTrigger_ShouldPassTriggerData()
        {
            var result = AssertTriggerType(
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

            Assert.That(result.Success, "Success");
        }

        [Test]
        public void Execute_ValidJobDataMapWithoutConversion_ShouldPassJobDataMap()
        {
            AddTriggerOutput result = AssertJobDataMap(
                new AddTriggerInput
                {
                    TriggerType = "Cron",
                    JobDataMap = new[]
                    {
                        new JobDataItem
                        {
                            Key = "StringKey",
                            Value = "StringValue",
                            InputTypeCode = "string"
                        }, 
                    }
                },
                jobDataMap =>
                {
                    Assert.That(jobDataMap, Is.Not.Null);
                    Assert.That(jobDataMap["StringKey"], Is.EqualTo("StringValue"));
                },
                new RegisteredInputType(new InputType("string"), null));

            AssertNoValidationIssues(result);
            Assert.That(result.Success, "Success");
        }

        [Test]
        public void Execute_ValidJobDataMapWithConversion_ShouldPassJobDataMap()
        {
            var customValue = new { };

            var converter = Substitute.For<IInputTypeConverter>();

            converter.Convert("CustomCode").Returns(customValue);

            AddTriggerOutput result = AssertJobDataMap(
                new AddTriggerInput
                {
                    TriggerType = "Cron",
                    JobDataMap = new[]
                    {
                        new JobDataItem
                        {
                            Key = "CustomKey",
                            Value = "CustomCode",
                            InputTypeCode = "custom"
                        }, 
                    }
                },
                jobDataMap =>
                {
                    Assert.That(jobDataMap, Is.Not.Null);
                    Assert.That(jobDataMap["CustomKey"], Is.EqualTo(customValue));
                },
                new RegisteredInputType(new InputType("custom"), converter));

            AssertNoValidationIssues(result);
            Assert.That(result.Success, "Success");
        }

        [Test]
        public void Execute_ValidJobDataConversionIssue_ShouldReturnValidationIssue()
        {
            var converter = Substitute.For<IInputTypeConverter>();
            converter.Convert("CustomCode").Throws(new Exception("Custom conversion issue"));

            var mock = new SubstitutableSchedulerHost();

            var command = new AddTriggerCommand(() => mock.Value, new[] { new RegisteredInputType(new InputType("custom"), converter) });

            AddTriggerOutput result = (AddTriggerOutput)command.Execute(new AddTriggerInput
            {
                TriggerType = "Cron",
                JobDataMap = new[]
                {
                    new JobDataItem
                    {
                        Key = "CustomKey",
                        Value = "CustomCode",
                        InputTypeCode = "custom"
                    },
                }
            });

            mock.SchedulerCommander.DidNotReceiveWithAnyArgs().ScheduleJob(null, null, null, null, null);

            Assert.That(result.Success, "Success");
            Assert.That(result.ValidationErrors, Is.Not.Null);
            Assert.That(result.ValidationErrors["CustomKey"], Is.EqualTo("Custom conversion issue"));
        }

        [Test]
        public void Execute_UnknownInputType_ShouldReturnValidationIssue()
        {
            var mock = new SubstitutableSchedulerHost();

            var command = new AddTriggerCommand(() => mock.Value, new RegisteredInputType[0]);

            AddTriggerOutput result = (AddTriggerOutput)command.Execute(new AddTriggerInput
            {
                TriggerType = "Cron",
                JobDataMap = new[]
                {
                    new JobDataItem
                    {
                        Key = "CustomKey",
                        Value = "CustomCode",
                        InputTypeCode = "custom"
                    },
                }
            });

            mock.SchedulerCommander.DidNotReceiveWithAnyArgs().ScheduleJob(null, null, null, null, null);

            Assert.That(result.Success, "Success");
            Assert.That(result.ValidationErrors, Is.Not.Null);
            Assert.That(result.ValidationErrors["CustomKey"], Is.EqualTo("Unknown input type: custom"));
        }

        [Test]
        public void Execute_UnknownTriggerType_ShouldReturnError()
        {
            var mock = new SubstitutableSchedulerHost();

            var command = new AddTriggerCommand(() => mock.Value, new RegisteredInputType[0]);

            AddTriggerOutput result = (AddTriggerOutput) command.Execute(new AddTriggerInput
            {
                TriggerType = "Unsupported"
            });

            Assert.That(result.Success, Is.False, "Success");
            Assert.That(result.ErrorMessage, Is.Not.Null);

            mock.SchedulerCommander.DidNotReceiveWithAnyArgs().ScheduleJob(null, null, null, null, null);
        }

        private AddTriggerOutput AssertTriggerType(AddTriggerInput input, Action<TriggerType> assertAction)
        {
            var mock = new SubstitutableSchedulerHost();

            var command = new AddTriggerCommand(() => mock.Value, new RegisteredInputType[0]);

            AddTriggerOutput result = (AddTriggerOutput) command.Execute(input);

            mock.SchedulerCommander
                .Received()
                .ScheduleJob(
                    Arg.Any<string>(), Arg.Any<string>(), Arg.Any<string>(),
                    Arg.Do(assertAction),
                    Arg.Any<IDictionary<string, object>>());

            return result;
        }

        private AddTriggerOutput AssertJobDataMap(
            AddTriggerInput input, 
            Action<IDictionary<string, object>> assertAction,
            params RegisteredInputType[] inputTypes)
        {
            var mock = new SubstitutableSchedulerHost();

            var command = new AddTriggerCommand(() => mock.Value, inputTypes);

            AddTriggerOutput result = (AddTriggerOutput) command.Execute(input);

            mock.SchedulerCommander
                .Received()
                .ScheduleJob(
                    Arg.Any<string>(), Arg.Any<string>(), Arg.Any<string>(),
                    Arg.Any<TriggerType>(),
                    Arg.Do(assertAction));

            return result;
        }

        private void AssertNoValidationIssues(AddTriggerOutput result)
        {
            Assert.That(result.ValidationErrors, Is.Null.Or.Empty);
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