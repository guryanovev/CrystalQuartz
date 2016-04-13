namespace CrystalQuartz.WebFramework.Owin
{
    using CrystalQuartz.WebFramework.HttpAbstractions;
    using Microsoft.Owin;

    public class OwinRequest : IRequest
    {
        private readonly IReadableStringCollection _query;
        private readonly IFormCollection _body;

        public OwinRequest(IReadableStringCollection query, IFormCollection body)
        {
            _query = query;
            _body = body;
        }

        public string this[string key]
        {
            get { return _query[key] ?? _body[key]; }
        }
    }
}