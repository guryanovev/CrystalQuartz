using System.Linq;
using Microsoft.AspNetCore.Http;
using CrystalQuartz.WebFramework.HttpAbstractions;

namespace CrystalQuartz.AspNetCore
{
    using System.Collections.Generic;

    public class AspNetCoreRequest : IRequest
    {
        private readonly IQueryCollection _query;
        private readonly IFormCollection _form;

        public AspNetCoreRequest(IQueryCollection query, IFormCollection form)
        {
            _query = query;
            _form = form;
        }

        public IEnumerable<string> AllKeys => _query.Keys.Concat(_form.Keys);

        public string this[string key]
        {
            get
            {
                if (_query.ContainsKey(key))
                {
                    return _query[key].ToArray().FirstOrDefault();
                }

                if (_form != null)
                {
                    return _form[key].ToArray().FirstOrDefault();
                }

                return null;
            }
        }
    }
}