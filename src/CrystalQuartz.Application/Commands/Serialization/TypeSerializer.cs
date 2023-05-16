namespace CrystalQuartz.Application.Commands.Serialization
{
    using System;
    using System.IO;
    using System.Threading.Tasks;
    using CrystalQuartz.WebFramework.Serialization;

    public class TypeSerializer : ISerializer<Type>
    {
        public async Task Serialize(Type target, TextWriter output)
        {
            if (target == null)
            {
                await output.WriteNull();
            }
            else
            {
                string fullName = target.FullName;
                int nameComponentIndex = fullName.LastIndexOf('.');

                await output.WriteValueString(
                    target.Assembly.GetName().Name +
                    '|' +
                    target.Namespace +
                    '|' +
                    (nameComponentIndex >= 0 ? fullName.Substring(nameComponentIndex + 1) : string.Empty));
            }
        }
    }
}