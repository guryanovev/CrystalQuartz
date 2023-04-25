using System.IO;
using CrystalQuartz.Core.Domain.ObjectTraversing;
using CrystalQuartz.WebFramework.Serialization;

namespace CrystalQuartz.Application.Comands.Serialization
{
    using System.Threading.Tasks;

    public class PropertyValueSerializer : ISerializer<PropertyValue>
    {
        public async Task Serialize(PropertyValue target, TextWriter output)
        {
            if (target == null)
            {
                await output.WriteNull();
            }
            else
            {
                await output.WriteAsync('{');

                await output.WritePropertyName("t");
                await CommonSerializers.TypeSerializer.Serialize(target.Type, output);

                if (target is ErrorPropertyValue error)
                {
                    await WriteTypeCode(output, "error");

                    await output.WriteAsync(',');
                    await output.WritePropertyName("_err");
                    await output.WriteValueString(error.Message);
                }
                else if (target is EllipsisPropertyValue)
                {
                    await WriteTypeCode(output, "...");
                }
                else if (target is SinglePropertyValue singlePropertyValue)
                {
                    await WriteTypeCode(output, "single");

                    await output.WriteAsync(',');
                    await output.WritePropertyName("v");
                    await output.WriteValueString(singlePropertyValue.RawValue);

                    await output.WriteAsync(',');
                    await output.WritePropertyName("k");
                    await output.WriteValueNumber((int)singlePropertyValue.Kind);
                }
                else if (target is ObjectPropertyValue objectPropertyValue)
                {
                    await WriteTypeCode(output, "object");

                    if (objectPropertyValue.PropertiesOverflow)
                    {
                        await WriteOverflow(output);
                    }

                    await output.WriteAsync(',');
                    await output.WritePropertyName("v");
                    await output.WriteAsync('{');

                    for (var index = 0; index < objectPropertyValue.NestedProperties.Length; index++)
                    {
                        Property nestedProperty = objectPropertyValue.NestedProperties[index];

                        if (index > 0)
                        {
                            await output.WriteAsync(',');
                        }

                        await output.WritePropertyName(nestedProperty.Title);
                        await Serialize(nestedProperty.Value, output);
                    }

                    await output.WriteAsync('}');
                }
                else if (target is EnumerablePropertyValue enumerablePropertyValue)
                {
                    await WriteTypeCode(output, "enumerable");

                    await output.WriteAsync(',');
                    await output.WritePropertyName("v");
                    await output.WriteArray(enumerablePropertyValue.Items, this);

                    if (enumerablePropertyValue.ItemsOverflow)
                    {
                        await WriteOverflow(output);
                    }
                }

                await output.WriteAsync('}');
            }
        }

        private static async Task WriteOverflow(TextWriter output)
        {
            await output.WriteAsync(',');
            await output.WritePropertyName("...");
            await output.WriteValueNumber(1);
        }

        private static async Task WriteTypeCode(TextWriter output, string value)
        {
            await output.WriteAsync(',');
            await output.WritePropertyName("_");
            await output.WriteValueString(value);
        }
    }
}