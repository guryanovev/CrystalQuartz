namespace CrystalQuartz.Owin
{
    using System.Collections.Generic;
    using System.Linq;
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

        public IEnumerable<string> AllKeys => _query.Select(x => x.Key).Concat(_body.Select(x => x.Key));

        public string this[string key]
        {
            get { return _query[key] ?? _body[key]; }
        }
    }
}