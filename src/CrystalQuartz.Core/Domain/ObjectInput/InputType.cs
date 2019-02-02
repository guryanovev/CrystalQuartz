namespace CrystalQuartz.Core.Domain.ObjectInput
{
    public class InputType
    {
        public InputType(string code) : this(code, code)
        {
        }

        public InputType(string code, string label)
        {
            Code = code;
            Label = label;
        }

        /// <summary>
        /// Gets input type unique code.
        /// </summary>
        public string Code { get; }

        /// <summary>
        /// Gets friendly input type label.
        /// </summary>
        public string Label { get; }
    }
}