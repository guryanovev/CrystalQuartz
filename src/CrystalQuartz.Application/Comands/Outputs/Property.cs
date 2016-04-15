namespace CrystalQuartz.Application.Comands.Outputs
{
    public class Property
    {
        public Property(string name, object value)
        {
            Name = name;
            TypeName = value == null ? null : value.GetType().Name;
            Value = value == null ? null : value.ToString();
        }

        public string Name { get; private set; }

        public string TypeName { get; private set; }

        public string Value { get; private set; }
    }
}