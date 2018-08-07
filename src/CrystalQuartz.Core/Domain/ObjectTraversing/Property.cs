namespace CrystalQuartz.Core.Domain.ObjectTraversing
{
    public class Property
    {
        public Property(string title, PropertyValue value)
        {
            Title = title;
            Value = value;
        }

        public string Title { get; }

        public PropertyValue Value { get; }
    }
}