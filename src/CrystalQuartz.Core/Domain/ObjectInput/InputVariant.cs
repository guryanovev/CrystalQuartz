namespace CrystalQuartz.Core.Domain.ObjectInput
{
    public class InputVariant
    {
        public InputVariant(string value, string label)
        {
            Value = value;
            Label = label;
        }

        /// <summary>
        /// Gets input raw value to be passed to the
        /// converter.
        /// </summary>
        public string Value { get; }

        /// <summary>
        /// Gets input variant friendly name.
        /// </summary>
        public string Label { get; }
    }
}