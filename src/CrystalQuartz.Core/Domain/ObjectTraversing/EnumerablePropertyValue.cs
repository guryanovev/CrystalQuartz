namespace CrystalQuartz.Core.Domain.ObjectTraversing
{
    using System;

    public class EnumerablePropertyValue : PropertyValue
    {
        public EnumerablePropertyValue(Type type, PropertyValue[] items, bool itemsOverflow = false)
            : base(type)
        {
            Items = items;
            ItemsOverflow = itemsOverflow;
        }

        public PropertyValue[] Items { get; }

        public bool ItemsOverflow { get; }
    }
}