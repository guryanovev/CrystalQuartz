using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using CrystalQuartz.Core.Utils;

namespace CrystalQuartz.Core.Domain.ObjectTraversing
{
    public class ObjectTraverser
    {
        public PropertyValue Traverse(object value, int level = 1)
        {
            if (value == null)
            {
                return null;
            }

            try
            {
                Type valueType = value.GetType();
                if (value is string || value is char)
                {
                    return new SinglePropertyValue(valueType, value.ToString(), SingleValueKind.String);
                }

                if (valueType.IsPrimitive)
                {
                    return new SinglePropertyValue(valueType, value.ToString(), SingleValueKind.Numeric);
                }

                if (value is DateTime date)
                {
                    return new SinglePropertyValue(valueType, date.UnixTicks().ToString(), SingleValueKind.Date);
                }

                if (value is Type type)
                {
                    return new SinglePropertyValue(valueType, type.ToString(), SingleValueKind.Type);
                }

                if (value is IDictionary<string, object> dictionary)
                {
                    return new ObjectPropertyValue(
                        valueType,
                        dictionary
                            .Keys
                            .Select(key => new Property(key, Traverse(dictionary[key], level + 1)))
                            .ToArray());
                }

                if (value is IEnumerable enumerable)
                {
                    return new EnumerablePropertyValue(
                        valueType,
                        enumerable.Cast<object>().Select(x => Traverse(x, level)).ToArray());
                }

                if (level > 5)
                {
                    return new ErrorPropertyValue("overflow");
                }

                var properties = valueType
                    .GetProperties()
                    .Where(p => p.CanRead)
                    .Where(p => p.GetIndexParameters().Length == 0)
                    .Select(p => new { Name = p.Name, Value = p.GetValue(value, null) })
                    .Where(p => p.Value != value)
                    .Select(prop => new Property(prop.Name, Traverse(prop.Value, level + 1)))
                    .ToArray();

                return new ObjectPropertyValue(
                    valueType,
                    properties);
            }
            catch (Exception ex)
            {
                return new ErrorPropertyValue(ex.Message);
            }
        }
    }
}