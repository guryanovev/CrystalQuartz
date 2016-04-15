namespace CrystalQuartz.Application
{
    using System;
    using System.Collections.Generic;
    using System.Web.Script.Serialization;
    using CrystalQuartz.Core.Domain;

    public class ActivityStatusConverter : JavaScriptConverter
    {
        public override object Deserialize(IDictionary<string, object> dictionary, Type type, JavaScriptSerializer serializer)
        {
            throw new InvalidOperationException();
        }

        public override IDictionary<string, object> Serialize(object obj, JavaScriptSerializer serializer)
        {
            var status = (ActivityStatus) obj;
            var resut = new Dictionary<string, object>();

            resut["Value"] = (int) status;
            resut["Code"] = status.ToString().ToLower();
            resut["Name"] = status.ToString();

            return resut;
        }

        public override IEnumerable<Type> SupportedTypes
        {
            get { yield return typeof (ActivityStatus); }
        }
    }
}