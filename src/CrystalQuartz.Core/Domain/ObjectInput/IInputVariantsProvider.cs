namespace CrystalQuartz.Core.Domain.ObjectInput
{
    using System.Collections.Generic;

    public interface IInputVariantsProvider
    {
        IEnumerable<InputVariant> GetVariants();
    }
}