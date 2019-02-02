namespace CrystalQuartz.Application.Comands
{
    using System.Linq;
    using CrystalQuartz.Application.Comands.Inputs;
    using CrystalQuartz.Application.Comands.Outputs;
    using CrystalQuartz.Core.Domain.ObjectInput;
    using CrystalQuartz.WebFramework.Commands;

    public class GetInputTypeVariantsCommand : AbstractCommand<InputTypeInput, InputTypeVariantsOutput>
    {
        private readonly RegisteredInputType[] _registeredInputTypes;

        public GetInputTypeVariantsCommand(RegisteredInputType[] registeredInputTypes)
        {
            _registeredInputTypes = registeredInputTypes;
        }

        protected override void InternalExecute(InputTypeInput input, InputTypeVariantsOutput output)
        {
            RegisteredInputType inputType = _registeredInputTypes.FirstOrDefault(x => x.InputType.Code == input.InputTypeCode);

            if (inputType == null)
            {
                output.ErrorMessage = "Unknown input type: " + input.InputTypeCode;
            }
            else if (inputType.VariantsProvider == null)
            {
                output.ErrorMessage = "Input type " + input.InputTypeCode + " has no variants provided";
            }
            else
            {
                output.Items = inputType.VariantsProvider.GetVariants().ToArray();
            }
        }
    }
}