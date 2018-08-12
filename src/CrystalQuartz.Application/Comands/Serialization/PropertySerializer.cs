using System.IO;
using CrystalQuartz.Core.Domain.ObjectTraversing;
using CrystalQuartz.WebFramework.Serialization;

namespace CrystalQuartz.Application.Comands.Serialization
{
    public class PropertyValueSerializer : ISerializer<PropertyValue>
    {
        public void Serialize(PropertyValue target, StreamWriter output)
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
                    output.Write(',');
                    output.WritePropertyName("_");
                    output.WriteValueString("error");

                    output.Write(',');
                    output.WritePropertyName("_err");
                    output.WriteValueString(error.Message);
                }
                else if (target is SinglePropertyValue singlePropertyValue)
                {
                    output.Write(',');
                    output.WritePropertyName("_");
                    output.WriteValueStringEscaped("single");

                    output.Write(',');
                    output.WritePropertyName("v");
                    output.WriteValueString(singlePropertyValue.RawValue);

                    output.Write(',');
                    output.WritePropertyName("k");
                    output.WriteValueNumber((int) singlePropertyValue.Kind);
                }
                else if (target is ObjectPropertyValue objectPropertyValue)
                {
                    output.Write(',');
                    output.WritePropertyName("_");
                    output.WriteValueStringEscaped("object");

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
                    output.Write(',');
                    output.WritePropertyName("_");
                    output.WriteValueStringEscaped("enumerable");

                    output.Write(',');
                    output.WritePropertyName("v");
                    output.WriteArray(enumerablePropertyValue.Items, this);
                }

                output.Write('}');
            }
        }
    }

//    public class PropertySerializer : ISerializer<Property>
//    {
//        public void Serialize(Property target, StreamWriter output)
//        {
//            if (target == null)
//            {
//                output.WriteNull();
//            }
//            else
//            {
//                output.Write('{');
//
//                output.WritePropertyName("t");
//                output.WriteValueString(target.Title);
//
//                output.Write(',');
//                output.WritePropertyName("ty");
//                CommonSerializers.TypeSerializer.Serialize(target.Type, output);
//
//                output.Write(',');
//                output.WritePropertyName("tc");
//                output.WriteValueString(target.TypeCode);
//
//                output.Write(',');
//                output.WritePropertyName("val");
//
//                if (target.Value == null)
//                {
//                    output.WriteNull();
//                }
//                else if (target.Value is ErrorPropertyValue errorValue)
//                {
//                    output.Write('{');
//                    output.WritePropertyName("_err");
//                    output.WriteValueString(errorValue.Message);
//                    output.Write('}');
//                }
//                else if (target.Value is EnumerablePropertyValue enumerableValue)
//                {
//                    //output.WriteArray(enumerableValue.Items, this);
//                }
//                else
//                {
//                    output.WriteValueString(target.Value.ToString());
//                }
////                else if (target.Value is Property)
////                {
////                    Serialize((Property) target.Value, output);
////                }
////                else if (target.Value is Property[])
////                {
////                    output.WriteArray((Property[]) target.Value, this);
////                }
////                else
////                {
////                    output.WriteValueString(target.Value.ToString());
////                }
//
//                output.Write('}');
//            }
//        }
//    }
}