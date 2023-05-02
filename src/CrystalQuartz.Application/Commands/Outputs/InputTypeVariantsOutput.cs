namespace CrystalQuartz.Application.Commands.Outputs
{
    using CrystalQuartz.Core.Domain.ObjectInput;
    using CrystalQuartz.WebFramework.Commands;

    public class InputTypeVariantsOutput : CommandResult
    {
        public InputVariant[] Items { get; set; }
    }
}