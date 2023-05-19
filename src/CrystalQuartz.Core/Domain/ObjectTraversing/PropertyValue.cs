namespace CrystalQuartz.Core.Domain.ObjectTraversing
{
    using System;

    public abstract class PropertyValue
    {
        protected PropertyValue(Type? type)
        {
            Type = type;
        }

        public Type? Type { get; }
    }
}