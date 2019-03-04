using System;
using System.IO;
using CrystalQuartz.WebFramework.Serialization;

namespace CrystalQuartz.Application.Comands.Serialization
{
    using System.Linq;

    public class TypeSerializer : ISerializer<Type>
    {
        public void Serialize(Type target, TextWriter output)
        {
            if (target == null)
            {
                output.WriteNull();
            }
            else
            {
                string fullName = target.FullName;
                int nameComponentIndex = fullName.LastIndexOf('.');

                output.WriteValueString(
                    target.Assembly.GetName().Name +
                    '|' +
                    target.Namespace +
                    '|' +
                    (nameComponentIndex >= 0 ? fullName.Substring(nameComponentIndex + 1) : string.Empty));
            }
        }
    }
}