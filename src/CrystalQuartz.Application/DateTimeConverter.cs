namespace CrystalQuartz.Application
{
    using System;
    using System.Collections.Generic;
    using System.Web.Script.Serialization;
    using CrystalQuartz.Core.Utils;

    internal class DateTimeConverter : JavaScriptConverter
    {
        public override object Deserialize(IDictionary<string, object> dictionary, Type type, JavaScriptSerializer serializer)
        {
            throw new InvalidOperationException();
        }

        public override IDictionary<string, object> Serialize(object obj, JavaScriptSerializer serializer)
        {
            if (obj == null)
            {
                return null;
            }

            var date = GetDate(obj);

            var result = new Dictionary<string, object>();
            result["Ticks"] = date.UnixTicks();
            result["UtcDateStr"] = date.ToString("G");
            result["ServerDateStr"] = date.ToLocalTime().ToString("G");

            return result;
        }

        private DateTime GetDate(object obj)
        {
            if (obj is DateTime)
            {
                return (DateTime) obj;
            }

            throw new Exception("Unexpected date value " + obj);
        }

        public override IEnumerable<Type> SupportedTypes
        {
            get
            {
                return new List<Type>
                       {
                           typeof(DateTime),
                           typeof(DateTime?),
                       };
            }
        }
    }
}