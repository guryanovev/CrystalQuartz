using System.Collections.Generic;
using System.IO;
using CrystalQuartz.Core.Domain;
using CrystalQuartz.WebFramework.Serialization;

namespace CrystalQuartz.Application.Comands.Serialization
{
    public class PropertySerializer : ISerializer<Property>
    {
        public void Serialize(Property target, StreamWriter output)
        {
            if (target == null)
            {
                output.WriteNull();
            }
            else
            {
                output.Write('{');

                output.WritePropertyName("t");
                output.WriteValueString(target.Title);

                output.Write(',');
                output.WritePropertyName("ty");
                CommonSerializers.TypeSerializer.Serialize(target.Type, output);

                output.Write(',');
                output.WritePropertyName("tc");
                output.WriteValueString(target.TypeCode);

                output.Write(',');
                output.WritePropertyName("val");

                if (target.Value == null)
                {
                    output.WriteNull();
                }
                else if (target.Value is Property)
                {
                    Serialize((Property) target.Value, output);
                }
                else if (target.Value is Property[])
                {
                    output.WriteArray((Property[]) target.Value, this);
                }
                else
                {
                    output.WriteValueString(target.Value.ToString());
                }

                output.Write('}');
            }
        }
    }
}