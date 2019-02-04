namespace CrystalQuartz.Core.Domain.ObjectInput
{
    using System.Collections.Generic;

    public class FixedInputVariantsProvider : IInputVariantsProvider
    {
        private readonly InputVariant[] _variants;

        public FixedInputVariantsProvider(params InputVariant[] variants)
        {
            _variants = variants;
        }

        public IEnumerable<InputVariant> GetVariants()
        {
            return _variants;
        }
    }
}