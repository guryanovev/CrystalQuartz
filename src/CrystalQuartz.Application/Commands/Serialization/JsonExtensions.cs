namespace CrystalQuartz.Application.Commands.Serialization
{
    using System.Collections.Generic;
    using System.Globalization;
    using System.IO;
    using System.Threading.Tasks;
    using CrystalQuartz.WebFramework.Serialization;

    public static class JsonExtensions
    {
        private const char Quote = '"';
        private const char Escape = '\\';

        private const string QuoteSemi = "\":";
        private const string Null = "null";

        public static Task WriteNull(this TextWriter streamWriter) => streamWriter.WriteAsync(Null);

        public static async Task WritePropertyName(this TextWriter streamWriter, string propertyName)
        {
            await streamWriter.WriteAsync(Quote);
            await streamWriter.WriteAsync(propertyName);
            await streamWriter.WriteAsync(QuoteSemi);
        }

        public static async Task WriteValueStringEscaped(this TextWriter streamWriter, string value)
        {
            await streamWriter.WriteAsync(Quote);
            await streamWriter.WriteAsync(value);
            await streamWriter.WriteAsync(Quote);
        }

        public static async Task WriteValueString(this TextWriter streamWriter, string value)
        {
            if (value == null)
            {
                await streamWriter.WriteNull();
                return;
            }

            await streamWriter.WriteAsync(Quote);

            foreach (char c in value)
            {
                if (c == Quote || c == Escape || c == '/')
                {
                    await streamWriter.WriteAsync(Escape);
                    await streamWriter.WriteAsync(c);
                } else if (c == '\b')
                {
                    await streamWriter.WriteAsync(Escape);
                    await streamWriter.WriteAsync('b');
                } else if (c == '\f')
                {
                    await streamWriter.WriteAsync(Escape);
                    await streamWriter.WriteAsync('f');
                } else if (c == '\n')
                {
                    await streamWriter.WriteAsync(Escape);
                    await streamWriter.WriteAsync('n');
                } else if (c == '\r')
                {
                    await streamWriter.WriteAsync(Escape);
                    await streamWriter.WriteAsync('r');
                } else if (c == '\t')
                {
                    await streamWriter.WriteAsync(Escape);
                    await streamWriter.WriteAsync('t');
                }
                else
                {
                    await streamWriter.WriteAsync(c);
                }
            }
            
            await streamWriter.WriteAsync(Quote);
        }

        public static Task WriteValueNumber(this TextWriter streamWriter, int value) => streamWriter.WriteAsync(value.ToString(CultureInfo.InvariantCulture));

        public static Task WriteValueNumber(this TextWriter streamWriter, long value) => streamWriter.WriteAsync(value.ToString(CultureInfo.InvariantCulture));

        public static async Task WriteArray<T>(this TextWriter streamWriter, IEnumerable<T> items, ISerializer<T> serializer)
        {
            await streamWriter.WriteAsync('[');

            bool isFirst = true;
            foreach (T item in items)
            {
                if (!isFirst)
                {
                    await streamWriter.WriteAsync(',');
                }
                else
                {
                    isFirst = false;
                }

                await serializer.Serialize(item, streamWriter);
            }

            await streamWriter.WriteAsync(']');
        }
    }
}