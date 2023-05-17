namespace CrystalQuartz.Core.Domain.ObjectTraversing
{
    using System;

    public class ObjectPropertyValue : PropertyValue
    {
        public ObjectPropertyValue(Type type, Property[] nestedProperties, bool propertiesOverflow = false)
            : base(type)
        {
            NestedProperties = nestedProperties;
            PropertiesOverflow = propertiesOverflow;
        }

        public Property[] NestedProperties { get; }

        public bool PropertiesOverflow { get; }
    }
}