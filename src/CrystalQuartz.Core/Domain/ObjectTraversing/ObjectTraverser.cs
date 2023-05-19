namespace CrystalQuartz.Core.Domain.ObjectTraversing
{
    using System;
    using System.Collections;
    using System.Collections.Generic;
    using System.Linq;
    using System.Reflection;
    using CrystalQuartz.Core.Utils;

    public class ObjectTraverser
    {
        private readonly TraversingOptions _options;

        public ObjectTraverser(TraversingOptions options)
        {
            _options = options;
        }

        public PropertyValue? Traverse(object? value, int level = 1)
        {
            return TraverseByAccessor(() => value, level);
        }

        public PropertyValue? TraverseByAccessor(Func<object?> accessor, int level = 1)
        {
            try
            {
                var value = accessor.Invoke();
                if (value == null)
                {
                    return null;
                }

                Type valueType = value.GetType();

                /* note that char is primitive */
                if (value is string || value is char)
                {
                    return new SinglePropertyValue(valueType, value.ToString(), SingleValueKind.String);
                }

                /* note that decimal is not primitive */
                if (valueType.IsPrimitive || value is decimal)
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
                    var keys = dictionary.Keys;

                    var nestedProperties = keys
                        .Take(_options.MaxPropertiesCount)
                        .Select(key => new Property(key, Traverse(dictionary[key], level + 1)))
                        .ToArray();

                    return new ObjectPropertyValue(
                        valueType,
                        nestedProperties,
                        keys.Count > nestedProperties.Length);
                }

                if (value is IEnumerable enumerable)
                {
                    var enumerableObject = enumerable.Cast<object>();
                    var count = enumerableObject.Count();

                    var nestedItems = enumerableObject
                        .Take(_options.MaxEnumerableLength)
                        .ToArray();

                    return new EnumerablePropertyValue(
                        valueType,
                        nestedItems
                            .Select(x => Traverse(x, level))
                            .ToArray(),
                        count > _options.MaxEnumerableLength);
                }

                if (level > _options.MaxGraphDepth)
                {
                    return new EllipsisPropertyValue();
                }

                var propertyDefinitions = valueType
                    .GetProperties()
                    .Where(p => p.CanRead)
                    .Where(p => p.GetIndexParameters().Length == 0)
                    .Select(p => new
                    {
                        Name = p.Name,
                        Value = new Func<object>(() => p.GetValue(value, null)),
                    })
                    .ToArray();

                var properties = propertyDefinitions
                    .Take(_options.MaxPropertiesCount)
                    .Select(prop => new Property(prop.Name, TraverseByAccessor(prop.Value, level + 1)))
                    .ToArray();

                return new ObjectPropertyValue(
                    valueType,
                    properties,
                    propertyDefinitions.Length > properties.Length);
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