using System;

namespace CrystalQuartz.Core.Domain.ObjectTraversing
{
    public abstract class PropertyValue
    {
        protected PropertyValue(Type type)
        {
            Type = type;
        }

        public Type Type { get; }
    }

    public class ErrorPropertyValue : PropertyValue
    {
        public ErrorPropertyValue(string message) : base(null)
        {
            Message = message;
        }

        public string Message { get; }
    }

    public enum SingleValueKind
    {
        Unknown,
        Numeric,
        String,
        Date,
        Type
    }

    public class SinglePropertyValue : PropertyValue
    {
        public SinglePropertyValue(Type type, string rawValue, SingleValueKind kind) : base(type)
        {
            RawValue = rawValue;
            Kind = kind;
        }

        public string RawValue { get; }

        public SingleValueKind Kind { get; }
    }

    public class ObjectPropertyValue : PropertyValue
    {
        public ObjectPropertyValue(Type type, Property[] nestedProperties) : base(type)
        {
            NestedProperties = nestedProperties;
        }

        public Property[] NestedProperties { get; }
    }

    public class EnumerablePropertyValue : PropertyValue
    {
        public EnumerablePropertyValue(Type type, PropertyValue[] items) : base(type)
        {
            Items = items;
        }

        public PropertyValue[] Items { get; }
    }
}