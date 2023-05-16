namespace CrystalQuartz.Core.Domain.ObjectTraversing
{
    using System;

    public class SinglePropertyValue : PropertyValue
    {
        public SinglePropertyValue(Type type, string rawValue, SingleValueKind kind)
            : base(type)
        {
            RawValue = rawValue;
            Kind = kind;
        }

        public string RawValue { get; }

        public SingleValueKind Kind { get; }
    }
}