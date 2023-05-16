namespace CrystalQuartz.Application.Commands.Outputs
{
    using CrystalQuartz.WebFramework.Commands;

    public class InputTypeItem
    {
        public string Code { get; set; }

        public string Label { get; set; }

        public bool HasVariants { get; set; }
    }

    public class InputTypesOutput : CommandResult
    {
        public InputTypeItem[] Items { get; set; }
    }
}