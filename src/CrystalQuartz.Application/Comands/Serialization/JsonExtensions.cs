using System.Collections.Generic;
using System.Globalization;
using System.IO;
using CrystalQuartz.WebFramework.Serialization;

namespace CrystalQuartz.Application.Comands.Serialization
{
    public static class JsonExtensions
    {
        private const char Quote = '"';
        private const char Escape = '\\';

        private const string QuoteSemi = "\":";
        private const string Null = "null";

        public static void WriteNull(this StreamWriter streamWriter)
        {
            streamWriter.Write(Null);
        }

        public static void WritePropertyName(this StreamWriter streamWriter, string propertyName)
        {
            streamWriter.Write(Quote);
            streamWriter.Write(propertyName);
            streamWriter.Write(QuoteSemi);
        }

        public static void WriteValueStringEscaped(this StreamWriter streamWriter, string value)
        {
            streamWriter.Write(Quote);
            streamWriter.Write(value);
            streamWriter.Write(Quote);
        }

        public static void WriteValueString(this StreamWriter streamWriter, string value)
        {
            if (value == null)
            {
                streamWriter.WriteNull();
                return;
            }

            streamWriter.Write(Quote);
            foreach (char c in value)
            {
                if (c == Quote || c == Escape || c == '/')
                {
                    streamWriter.Write(Escape);
                    streamWriter.Write(c);
                } else if (c == '\b')
                {
                    streamWriter.Write(Escape);
                    streamWriter.Write('b');
                } else if (c == '\f')
                {
                    streamWriter.Write(Escape);
                    streamWriter.Write('f');
                } else if (c == '\n')
                {
                    streamWriter.Write(Escape);
                    streamWriter.Write('n');
                } else if (c == '\r')
                {
                    streamWriter.Write(Escape);
                    streamWriter.Write('r');
                } else if (c == '\t')
                {
                    streamWriter.Write(Escape);
                    streamWriter.Write('t');
                }
                else
                {
                    streamWriter.Write(c);
                }
            }
            
            streamWriter.Write(Quote);
        }

        public static void WriteValueNumber(this StreamWriter streamWriter, int value)
        {
            streamWriter.Write(value.ToString(CultureInfo.InvariantCulture));
        }

        public static void WriteValueNumber(this StreamWriter streamWriter, long value)
        {
            streamWriter.Write(value.ToString(CultureInfo.InvariantCulture));
        }

        public static void WriteArray<T>(this StreamWriter streamWriter, IEnumerable<T> items, ISerializer<T> serializer)
        {
            streamWriter.Write('[');

            bool isFirst = true;
            foreach (T item in items)
            {
                if (!isFirst)
                {
                    streamWriter.Write(',');
                }
                else
                {
                    isFirst = false;
                }

                serializer.Serialize(item, streamWriter);
            }

            streamWriter.Write(']');
        }
    }
}