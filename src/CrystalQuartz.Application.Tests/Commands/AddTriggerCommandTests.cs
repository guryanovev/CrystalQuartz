namespace CrystalQuartz.Application.Tests.Commands
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Application.Commands;
    using Application.Commands.Inputs;
    using Application.Commands.Outputs;
    using CrystalQuartz.Application.Tests.Stubs;
    using CrystalQuartz.Core.Domain.ObjectInput;
    using CrystalQuartz.Core.Domain.TriggerTypes;
    using CrystalQuartz.Stubs;
    using NSubstitute;
    using NSubstitute.ExceptionExtensions;
    using NUnit.Framework;

    [TestFixture]
    public class AddTriggerCommandTests
    {
        [Test]
        public async Task Execute_NoJobClass_ShouldAddTriggerToExistingJob()
        {
            const string groupName = "Group";
            const string jobName = "Job";

            var stub = new SchedulerHostStub();

            var command = new AddTriggerCommand(() => stub.Value, new RegisteredInputType[0]);

            AddTriggerOutput result = (AddTriggerOutput) await command.Execute(new AddTriggerInput
            {
                Group = groupName,
                Job = jobName,
                Name = "Trigger",
                TriggerType = "Simple"
            });

            result.AssertSuccessfull();

            GroupStub group = stub.GetSingleGroup();
            JobStub job = group.GetSingleJob();
            TriggerStub trigger = job.GetSingleTrigger();

            Assert.That(group.Name, Is.EqualTo(groupName));
            Assert.That(job.Name, Is.EqualTo(jobName));
            Assert.That(job.JobType, Is.Null);
            Assert.That(trigger.Name, Is.EqualTo("Trigger"));
        }

        [Test]
        public async Task Execute_JobClassProvided_ShouldScheduleNewJob()
        {
            const string groupName = "Group";
            const string jobName = "Job";

            var stub = new SchedulerHostStub(new[] { typeof(System.Object)});

            var command = new AddTriggerCommand(() => stub.Value, new RegisteredInputType[0]);

            AddTriggerOutput result = (AddTriggerOutput) await command.Execute(new AddTriggerInput
            {
                Group = groupName,
                Job = jobName,
                JobClass = typeof(System.Object).ToString(),
                Name = "Trigger",
                TriggerType = "Simple"
            });

            result.AssertSuccessfull();

            GroupStub group = stub.GetSingleGroup();
            JobStub job = group.GetSingleJob();
            TriggerStub trigger = job.GetSingleTrigger();

            Assert.That(group.Name, Is.EqualTo(groupName));
            Assert.That(job.Name, Is.EqualTo(jobName));
            Assert.That(job.JobType, Is.EqualTo(typeof(System.Object)));
            Assert.That(trigger.Name, Is.EqualTo("Trigger"));
        }

        [Test]
        public async Task Execute_JobClassIsNotAllowed_ShouldFail()
        {
            var stub = new SchedulerHostStub();

            var command = new AddTriggerCommand(() => stub.Value, new RegisteredInputType[0]);

            AddTriggerOutput result = (AddTriggerOutput) await command.Execute(new AddTriggerInput
            {
                JobClass = typeof(System.Object).ToString(),
                Name = "Trigger",
                TriggerType = "Simple"
            });

            Assert.That(result.Success, Is.False, "Success");
        }

        [Test]
        public async Task Execute_NoJobClassOrNameProvided_ShouldFail()
        {
            var stub = new SchedulerHostStub(new[] { typeof(System.Object) });

            var command = new AddTriggerCommand(() => stub.Value, new RegisteredInputType[0]);

            AddTriggerOutput result = (AddTriggerOutput) await command.Execute(new AddTriggerInput
            {
                Group = "Group",
                TriggerType = "Simple"
            });

            Assert.That(result.Success, Is.False);
            Assert.That(stub.SchedulerCommander.Groups.Count, Is.EqualTo(0));
        }

        [Test]
        public async Task Execute_SimpleTriggerWithRepeatCount_ShouldPassTriggerData()
        {
            await AssertTriggerType(
                new AddTriggerInput
                {
                    Job = "Default",
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
        public async Task Execute_InfiniteSimpleTrigger_ShouldPassTriggerData()
        {
            await AssertTriggerType(
                new AddTriggerInput
                {
                    Job = "Default",
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
        public async Task Execute_CronTrigger_ShouldPassTriggerData()
        {
            await AssertTriggerType(
                new AddTriggerInput
                {
                    Job = "Default",
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

        [Test]
        public async Task Execute_ValidJobDataMapWithoutConversion_ShouldPassJobDataMap()
        {
            AddTriggerOutput result = await AssertTriggerJobDataMap(
                new AddTriggerInput
                {
                    Job = "Default",
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
        }

        [Test]
        public async Task Execute_ValidJobDataMapWithConversion_ShouldPassJobDataMap()
        {
            var customValue = new { };

            var converter = Substitute.For<IInputTypeConverter>();

            converter.Convert("CustomCode").Returns(customValue);

            AddTriggerOutput result = await AssertTriggerJobDataMap(
                new AddTriggerInput
                {
                    Job = "Default",
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
        }

        [Test]
        public async Task Execute_ValidJobDataConversionIssue_ShouldReturnValidationIssue()
        {
            var converter = Substitute.For<IInputTypeConverter>();
            converter.Convert("CustomCode").Throws(new Exception("Custom conversion issue"));

            var stub = new SchedulerHostStub(new Type[0]);

            var command = new AddTriggerCommand(() => stub.Value, new[] { new RegisteredInputType(new InputType("custom"), converter) });

            AddTriggerOutput result = (AddTriggerOutput) await command.Execute(new AddTriggerInput
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

            stub.AssertEmpty();

            result.AssertSuccessfull();

            Assert.That(result.ValidationErrors, Is.Not.Null);
            Assert.That(result.ValidationErrors["CustomKey"], Is.EqualTo("Custom conversion issue"));
        }

        [Test]
        public async Task Execute_UnknownInputType_ShouldReturnValidationIssue()
        {
            var stub = new SchedulerHostStub();

            var command = new AddTriggerCommand(() => stub.Value, new RegisteredInputType[0]);

            AddTriggerOutput result = (AddTriggerOutput) await command.Execute(new AddTriggerInput
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

            stub.AssertEmpty();

            result.AssertSuccessfull();

            Assert.That(result.ValidationErrors, Is.Not.Null);
            Assert.That(result.ValidationErrors["CustomKey"], Is.EqualTo("Unknown input type: custom"));
        }

        [Test]
        public async Task Execute_UnknownTriggerType_ShouldReturnError()
        {
            var stub = new SchedulerHostStub();

            var command = new AddTriggerCommand(() => stub.Value, new RegisteredInputType[0]);

            AddTriggerOutput result = (AddTriggerOutput) await command.Execute(new AddTriggerInput
            {
                TriggerType = "Unsupported"
            });

            Assert.That(result.Success, Is.False, "Success");
            Assert.That(result.ErrorMessage, Is.Not.Null);

            stub.AssertEmpty();
        }

        private async Task<AddTriggerOutput> AssertTriggerType(AddTriggerInput input, Action<TriggerType> assertAction)
        {
            var stub = new SchedulerHostStub();

            var command = new AddTriggerCommand(() => stub.Value, new RegisteredInputType[0]);

            AddTriggerOutput result = (AddTriggerOutput) await command.Execute(input);

            result.AssertSuccessfull();

            TriggerStub trigger = stub.GetSingleGroup().GetSingleJob().GetSingleTrigger();
            assertAction(trigger.Trigger);

            return result;
        }

        private async Task<AddTriggerOutput> AssertTriggerJobDataMap(
            AddTriggerInput input, 
            Action<IDictionary<string, object>> assertAction,
            params RegisteredInputType[] inputTypes)
        {
            var stub = new SchedulerHostStub();

            var command = new AddTriggerCommand(() => stub.Value, inputTypes);

            AddTriggerOutput result = (AddTriggerOutput) await command.Execute(input);

            result.AssertSuccessfull();
            assertAction(stub.GetSingleGroup().GetSingleJob().GetSingleTrigger().TriggerJobData);

            return result;
        }

        private void AssertNoValidationIssues(AddTriggerOutput result)
        {
            Assert.That(result.ValidationErrors, Is.Null.Or.Empty);
        }
    }
}