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

    public class EllipsisPropertyValue : PropertyValue
    {
        public EllipsisPropertyValue() : base(null)
        {
        }
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
        public ObjectPropertyValue(Type type, Property[] nestedProperties, bool propertiesOverflow = false) : base(type)
        {
            NestedProperties = nestedProperties;
            PropertiesOverflow = propertiesOverflow;
        }

        public Property[] NestedProperties { get; }

        public bool PropertiesOverflow { get; }
    }

    public class EnumerablePropertyValue : PropertyValue
    {
        public EnumerablePropertyValue(Type type, PropertyValue[] items, bool itemsOverflow = false) : base(type)
        {
            Items = items;
            ItemsOverflow = itemsOverflow;
        }

        public PropertyValue[] Items { get; }

        public bool ItemsOverflow { get; }
    }
}