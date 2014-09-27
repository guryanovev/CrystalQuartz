namespace CrystalQuartz.WebFramework.Routing
{
    using System.Collections.Generic;

    public class UrlData
    {
        public static UrlData NotMatching = new UrlData(false, new Dictionary<string, string>());
        
        private readonly bool _matchingUrl;
        private readonly IDictionary<string, string> _parameters;

        public UrlData(bool matchingUrl, IDictionary<string, string> parameters)
        {
            _matchingUrl = matchingUrl;
            _parameters = parameters;
        }

        public bool MatchingUrl
        {
            get { return _matchingUrl; }
        }

        public IDictionary<string, string> Parameters
        {
            get { return _parameters; }
        }
    }
}