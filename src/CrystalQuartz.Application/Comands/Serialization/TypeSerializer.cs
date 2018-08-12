using System;
using System.IO;
using CrystalQuartz.WebFramework.Serialization;

namespace CrystalQuartz.Application.Comands.Serialization
{
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
                output.WriteValueString(
                    target.Assembly.GetName().Name +
                    '|' +
                    target.Namespace +
                    '|' +
                    target.Name);
            }
        }
    }
}