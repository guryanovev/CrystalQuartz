namespace CrystalQuartz.WebFramework.Response
{
    using System.IO;
    using System.Web;
    using System.Web.Script.Serialization;

    public class JsonResponseFiller : DefaultResponseFiller
    {
        private readonly object _model;
        private readonly JavaScriptSerializer _serializer;

        public JsonResponseFiller(object model, JavaScriptSerializer serializer)
        {
            _model = model;
            _serializer = serializer;
        }

        public override string ContentType
        {
            get { return "application/json"; }
        }

        protected override void InternalFillResponse(HttpResponseBase response, HttpContextBase context)
        {
            var serialized = _serializer.Serialize(_model);
            using (var writer = new StreamWriter(response.OutputStream))
            {
                writer.WriteLine(serialized);
            }
        }
    }
}