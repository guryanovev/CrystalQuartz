namespace CrystalQuartz.Application.Tests.Commands
{
    using System.Threading.Tasks;
    using Application.Commands;
    using Application.Commands.Inputs;
    using Application.Commands.Outputs;
    using CrystalQuartz.Core.Domain.ObjectInput;
    using NUnit.Framework;

    [TestFixture]
    public class GetInputTypeVariantsCommandTests
    {
        [Test]
        public async Task Execute_HasInputTypeWithVariants_ShouldProvideVariants()
        {
            var command = new GetInputTypeVariantsCommand(
                new[]
                {
                    new RegisteredInputType(
                        new InputType("string"),
                        null,
                        new FixedInputVariantsProvider(
                            new InputVariant("value1", "Value 1"),
                            new InputVariant("value2", "Value 2"))),
                });

            InputTypeVariantsOutput result = (InputTypeVariantsOutput) await command.Execute(
                new InputTypeInput
                {
                    InputTypeCode = "string"
                });

            Assert.That(result.Success);
            Assert.That(result.Items, Is.Not.Null);
            Assert.That(result.Items.Length, Is.EqualTo(2));

            Assert.That(result.Items[0].Value, Is.EqualTo("value1"));
            Assert.That(result.Items[0].Label, Is.EqualTo("Value 1"));

            Assert.That(result.Items[1].Value, Is.EqualTo("value2"));
            Assert.That(result.Items[1].Label, Is.EqualTo("Value 2"));
        }

        [Test]
        public async Task Execute_UnknownInputType_ShouldReturnError()
        {
            var command = new GetInputTypeVariantsCommand(new RegisteredInputType[0]);

            InputTypeVariantsOutput result = (InputTypeVariantsOutput) await command.Execute(
                new InputTypeInput
                {
                    InputTypeCode = "string"
                });

            Assert.That(result.Success, Is.False);
            Assert.That(result.ErrorMessage, Is.EqualTo("Unknown input type: string"));
        }

        [Test]
        public async Task Execute_InputTypeWithoutVariantsProvider_ShouldReturnError()
        {
            var command = new GetInputTypeVariantsCommand(new[]
            {
                new RegisteredInputType(
                    new InputType("string"), 
                    null,
                    null), 
            });

            InputTypeVariantsOutput result = (InputTypeVariantsOutput) await command.Execute(
                new InputTypeInput
                {
                    InputTypeCode = "string"
                });

            Assert.That(result.Success, Is.False);
            Assert.That(result.ErrorMessage, Is.EqualTo("Input type string has no variants provided"));
        }
    }
}