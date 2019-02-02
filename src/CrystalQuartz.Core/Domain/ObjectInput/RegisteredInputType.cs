namespace CrystalQuartz.Core.Domain.ObjectInput
{
    public class RegisteredInputType
    {
        /// <summary>
        /// Creates new instance to store input type data.
        /// </summary>
        /// <param name="inputType">Input type declaration</param>
        /// <param name="converter">Converter to use for this input type or <code>Null</code> to use raw string value.</param>
        /// <param name="variantsProvider"></param>
        public RegisteredInputType(InputType inputType, IInputTypeConverter converter, IInputVariantsProvider variantsProvider = null)
        {
            InputType = inputType;
            Converter = converter;
            VariantsProvider = variantsProvider;
        }

        public InputType InputType { get; }

        public IInputTypeConverter Converter { get; }

        public IInputVariantsProvider VariantsProvider { get; }
    }
}