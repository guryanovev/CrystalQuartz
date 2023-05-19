namespace CrystalQuartz.Core.Domain.ObjectInput
{
    public class RegisteredInputType
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="RegisteredInputType"/> class.
        /// </summary>
        /// <param name="inputType">Input type declaration.</param>
        /// <param name="converter">Converter to use for this input type or null to use raw string value.</param>
        /// <param name="variantsProvider">Variants provider.</param>
        public RegisteredInputType(
            InputType inputType,
            IInputTypeConverter? converter,
            IInputVariantsProvider? variantsProvider = null)
        {
            InputType = inputType;
            Converter = converter;
            VariantsProvider = variantsProvider;
        }

        public InputType InputType { get; }

        public IInputTypeConverter? Converter { get; }

        public IInputVariantsProvider? VariantsProvider { get; }
    }
}