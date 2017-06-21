namespace CrystalQuartz.Application
{
    using System;
    using System.Collections.Generic;
    using System.Web.Script.Serialization;

    public class TypeConverter : JavaScriptConverter
    {
        public override object Deserialize(IDictionary<string, object> dictionary, Type type, JavaScriptSerializer serializer)
        {
            throw new NotImplementedException();
        }

        public override IDictionary<string, object> Serialize(object obj, JavaScriptSerializer serializer)
        {
            Type type = (Type) obj;
            return new Dictionary<string, object>
            {
                { "Namespace", type.Namespace },
                { "Name", type.Name },
                { "Assembly", type.Assembly.GetName().Name }
            };
        }

        public override IEnumerable<Type> SupportedTypes
        {
            get
            {
                return new[]
                {
                    typeof(Type)
                };
            }
        }
    }
}