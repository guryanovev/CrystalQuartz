namespace CrystalQuartz.WebFramework.Binding
{
    using System;
    using System.Linq;
    using System.Reflection;
    using CrystalQuartz.WebFramework.HttpAbstractions;

    public class ReflectionBinder
    {
        public object Bind(Type type, IRequest request)
        {
            var form = Activator.CreateInstance(type);

            foreach (var propertyInfo in form.GetType().GetProperties())
            {
                if (propertyInfo.CanWrite)
                {
                    object value = FetchValue(propertyInfo, request);

                    if (value != null)
                    {
                        propertyInfo.SetValue(form, value, null);
                    }
                }
            }

            return form;
        }

        private object FetchValue(PropertyInfo propertyInfo, IRequest request)
        {
            if (propertyInfo.PropertyType.IsArray)
            {
                string propertyNamePrefix = propertyInfo.Name.ToUpperInvariant() + "[";

                Type elementType = propertyInfo.PropertyType.GetElementType();

                object[] items = request.AllKeys
                    .Where(k => k.StartsWith(propertyNamePrefix, StringComparison.InvariantCultureIgnoreCase))
                    .Select(k =>
                    {
                        string tail = k.Substring(propertyNamePrefix.Length);

                        int tailIndex = 0;
                        while (tailIndex < tail.Length - 1 /* ] should not be the last char so we do - 1 */)
                        {
                            if (tail[tailIndex] == ']')
                            {
                                return new
                                {
                                    IndexCode = tail.Substring(0, tailIndex),
                                    NestedKey = tail.Substring(tailIndex + 2),
                                    OriginalKey = k
                                };
                            }

                            tailIndex++;
                        }

                        return null;
                    })
                    .Where(x => x != null)
                    .GroupBy(x => x.IndexCode)
                    .Select(group =>
                    {
                        var nestedRequest = new DictionaryRequest();
                        foreach (var item in group)
                        {
                            nestedRequest[item.NestedKey] = request[item.OriginalKey];
                        }

                        return Bind(elementType, nestedRequest);
                    })
                    .ToArray();

                if (items.Length == 0)
                {
                    return null;
                }

                var result = Array.CreateInstance(elementType, items.Length);
                for (var index = 0; index < items.Length; index++)
                {
                    result.SetValue(items[index], index);
                }

                return result;
            }

            var formPropertyValue = request[propertyInfo.Name];
            if (formPropertyValue == null)
            {
                return null;
            }

            if (propertyInfo.PropertyType == typeof(string))
            {
                return formPropertyValue;
            }

            // support for smarter primitive types binding if needed
            return Convert.ChangeType(formPropertyValue, propertyInfo.PropertyType);
        }
    }
}