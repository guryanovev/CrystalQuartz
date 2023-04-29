namespace CrystalQuartz.Application.Comands
{
    using System.Linq;
    using System.Threading.Tasks;
    using CrystalQuartz.Application.Comands.Inputs;
    using CrystalQuartz.Application.Comands.Outputs;
    using CrystalQuartz.Core.Domain.ObjectInput;
    using CrystalQuartz.WebFramework.Commands;

    public class GetInputTypesCommand : AbstractCommand<NoInput, InputTypesOutput>
    {
        private readonly RegisteredInputType[] _registeredInputTypes;

        public GetInputTypesCommand(RegisteredInputType[] registeredInputTypes)
        {
            _registeredInputTypes = registeredInputTypes;
        }

        protected override Task InternalExecute(NoInput input, InputTypesOutput output)
        {
            output.Items = _registeredInputTypes
                .Select(x => new InputTypeItem
                {
                    Code = x.InputType.Code,
                    Label = x.InputType.Label,
                    HasVariants = x.VariantsProvider != null
                })
                .ToArray();

            return AsyncUtils.CompletedTask();
        }
    }
}