namespace CrystalQuartz.Core.Domain.Base
{
    public class NamedObject
    {
        public NamedObject(string name)
        {
            Name = name;
        }

        public string Name { get; }
    }
}