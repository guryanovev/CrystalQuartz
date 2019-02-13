namespace CrystalQuartz.Application.Tests.Commands
{
    using CrystalQuartz.Application.Comands;
    using CrystalQuartz.Application.Comands.Inputs;
    using CrystalQuartz.Application.Comands.Outputs;
    using CrystalQuartz.Core.Domain.ObjectInput;
    using NUnit.Framework;

    [TestFixture]
    public class GetInputTypesCommandTests
    {
        [Test]
        public void Execute_HasInputTypes_ShouldPassCodeAndLabel()
        {
            var command = new GetInputTypesCommand(new[]
            {
                new RegisteredInputType(new InputType("string", "String"), null)
            });

            InputTypesOutput result = (InputTypesOutput) command.Execute(new NoInput());

            Assert.That(result.Success, Is.True);
            Assert.That(result.Items, Is.Not.Null);
            Assert.That(result.Items.Length, Is.EqualTo(1));
            Assert.That(result.Items[0].Code, Is.EqualTo("string"));
            Assert.That(result.Items[0].Label, Is.EqualTo("String"));
        }

        [Test]
        public void Execute_HasInputTypesWithoutVariants_ShouldSetVariantsToFalse()
        {
            var command = new GetInputTypesCommand(new[]
            {
                new RegisteredInputType(new InputType("string", "String"), null)
            });

            InputTypesOutput result = (InputTypesOutput) command.Execute(new NoInput());

            Assert.That(result.Success, Is.True);
            Assert.That(result.Items, Is.Not.Null);
            Assert.That(result.Items.Length, Is.EqualTo(1));
            Assert.That(result.Items[0].HasVariants, Is.False);
        }

        [Test]
        public void Execute_HasInputTypesWithVariants_ShouldSetVariantsToTrue()
        {
            var command = new GetInputTypesCommand(new[]
            {
                new RegisteredInputType(
                    new InputType("string", "String"), 
                    null, 
                    new FixedInputVariantsProvider())
            });

            InputTypesOutput result = (InputTypesOutput) command.Execute(new NoInput());

            Assert.That(result.Success, Is.True);
            Assert.That(result.Items, Is.Not.Null);
            Assert.That(result.Items.Length, Is.EqualTo(1));
            Assert.That(result.Items[0].HasVariants, Is.True);
        }
    }
}