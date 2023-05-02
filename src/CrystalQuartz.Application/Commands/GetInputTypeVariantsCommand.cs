namespace CrystalQuartz.Application.Commands
{
    using System.Linq;
    using System.Threading.Tasks;
    using CrystalQuartz.Core.Domain.ObjectInput;
    using CrystalQuartz.WebFramework.Commands;
    using Inputs;
    using Outputs;

    public class GetInputTypeVariantsCommand : AbstractCommand<InputTypeInput, InputTypeVariantsOutput>
    {
        private readonly RegisteredInputType[] _registeredInputTypes;

        public GetInputTypeVariantsCommand(RegisteredInputType[] registeredInputTypes)
        {
            _registeredInputTypes = registeredInputTypes;
        }

        protected override Task InternalExecute(InputTypeInput input, InputTypeVariantsOutput output)
        {
            RegisteredInputType inputType = _registeredInputTypes.FirstOrDefault(x => x.InputType.Code == input.InputTypeCode);

            if (inputType == null)
            {
                output.Success = false;
                output.ErrorMessage = "Unknown input type: " + input.InputTypeCode;
            }
            else if (inputType.VariantsProvider == null)
            {
                output.Success = false;
                output.ErrorMessage = "Input type " + input.InputTypeCode + " has no variants provided";
            }
            else
            {
                output.Items = inputType.VariantsProvider.GetVariants().ToArray();
            }

            return AsyncUtils.CompletedTask();
        }
    }
}