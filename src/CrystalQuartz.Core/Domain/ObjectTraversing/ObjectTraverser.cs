using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using CrystalQuartz.Core.Utils;

namespace CrystalQuartz.Core.Domain.ObjectTraversing
{
    using System.Reflection;

    public class ObjectTraverser
    {
        public PropertyValue Traverse(object value, int level = 1)
        {
            return TraverseByAccessor(() => value, level);
        }

        public PropertyValue TraverseByAccessor(Func<object> accessor, int level = 1)
        {
            try
            {
                var value = accessor.Invoke();
                if (value == null)
                {
                    return null;
                }

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

                if (level > 5 /* todo: move to options */)
                {
                    return new ErrorPropertyValue("overflow");
                }

                var properties = valueType
                    .GetProperties()
                    .Where(p => p.CanRead)
                    .Where(p => p.GetIndexParameters().Length == 0)
                    .Select(p => new
                    {
                        Name = p.Name,
                        Value = new Func<object>(() => p.GetValue(value, null))
                    })
                    .Select(prop => new Property(prop.Name, TraverseByAccessor(prop.Value, level + 1)))
                    .ToArray();

                return new ObjectPropertyValue(
                    valueType,
                    properties);
            }
            catch (TargetInvocationException ex)
            {
                // We call object properties via reflection,
                // so every error would be wrapped with
                // TargetInvocationException. Unwrap it here
                // to provide original exception message.

                return new ErrorPropertyValue(ex.InnerException?.Message ?? ex.Message);
            }
            catch (Exception ex)
            {
                return new ErrorPropertyValue(ex.Message);
            }
        }
    }
}