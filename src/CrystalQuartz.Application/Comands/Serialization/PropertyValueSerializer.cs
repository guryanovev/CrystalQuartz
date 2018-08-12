using System.IO;
using CrystalQuartz.Core.Domain.ObjectTraversing;
using CrystalQuartz.WebFramework.Serialization;

namespace CrystalQuartz.Application.Comands.Serialization
{
    public class PropertyValueSerializer : ISerializer<PropertyValue>
    {
        public void Serialize(PropertyValue target, TextWriter output)
        {
            if (target == null)
            {
                output.WriteNull();
            }
            else
            {
                output.Write('{');

                output.WritePropertyName("t");
                CommonSerializers.TypeSerializer.Serialize(target.Type, output);

                if (target is ErrorPropertyValue error)
                {
                    WriteTypeCode(output, "error");

                    output.Write(',');
                    output.WritePropertyName("_err");
                    output.WriteValueString(error.Message);
                }
                else if (target is EllipsisPropertyValue)
                {
                    WriteTypeCode(output, "...");
                }
                else if (target is SinglePropertyValue singlePropertyValue)
                {
                    WriteTypeCode(output, "single");

                    output.Write(',');
                    output.WritePropertyName("v");
                    output.WriteValueString(singlePropertyValue.RawValue);

                    output.Write(',');
                    output.WritePropertyName("k");
                    output.WriteValueNumber((int)singlePropertyValue.Kind);
                }
                else if (target is ObjectPropertyValue objectPropertyValue)
                {
                    WriteTypeCode(output, "object");

                    if (objectPropertyValue.PropertiesOverflow)
                    {
                        WriteOverflow(output);
                    }

                    output.Write(',');
                    output.WritePropertyName("v");
                    output.Write('{');

                    for (var index = 0; index < objectPropertyValue.NestedProperties.Length; index++)
                    {
                        Property nestedProperty = objectPropertyValue.NestedProperties[index];

                        if (index > 0)
                        {
                            output.Write(',');
                        }

                        output.WritePropertyName(nestedProperty.Title);
                        Serialize(nestedProperty.Value, output);
                    }

                    output.Write('}');
                }
                else if (target is EnumerablePropertyValue enumerablePropertyValue)
                {
                    WriteTypeCode(output, "enumerable");

                    output.Write(',');
                    output.WritePropertyName("v");
                    output.WriteArray(enumerablePropertyValue.Items, this);

                    if (enumerablePropertyValue.ItemsOverflow)
                    {
                        WriteOverflow(output);
                    }
                }

                output.Write('}');
            }
        }

        private static void WriteOverflow(TextWriter output)
        {
            output.Write(',');
            output.WritePropertyName("...");
            output.WriteValueNumber(1);
        }

        private static void WriteTypeCode(TextWriter output, string value)
        {
            output.Write(',');
            output.WritePropertyName("_");
            output.WriteValueString(value);
        }
    }
}