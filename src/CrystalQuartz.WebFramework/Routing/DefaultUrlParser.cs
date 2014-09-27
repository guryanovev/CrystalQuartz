namespace CrystalQuartz.WebFramework.Routing
{
    using System.Collections.Generic;
    using System.Linq;
    using System.Text.RegularExpressions;

    public class DefaultUrlParser : IUrlParser
    {
        private const string _paramsPattern = @"\{[^\{\}]*\}";

        public UrlData Parse(string url, string pattern)
        {
            PatternData patternData = ConvertToRegexPattern(pattern);
            var match = Regex.Match(url, patternData.PatternValue);
            if (!match.Success)
            {
                return UrlData.NotMatching;
            }

            var groups = match
                .Groups
                .Cast<Group>()
                .Skip(1)
                .OrderBy(g => g.Index)
                .ToList();

//            var parameters = patternData
//                .ParamNames
//                .Zip(groups, (s, @group) => new KeyValuePair<string, string>(s, group.Value))
//                .ToDictionary(pair => pair.Key, pair => pair.Value);

            return new UrlData(true, null);
        }

        private PatternData ConvertToRegexPattern(string pattern)
        {
            var names = new List<string>();
            var result = Regex.Replace(pattern, _paramsPattern, match =>
            {
                names.Add(match.Value.Substring(1, match.Value.Length - 2));

                return "(.*)";
            });

            return new PatternData(result, names.ToArray());
        }
    }

    internal class PatternData
    {
        private readonly string _patternValue;
        private readonly string[] _paramNames;

        public PatternData(string patternValue, string[] paramNames)
        {
            _patternValue = patternValue;
            _paramNames = paramNames;
        }

        public string PatternValue
        {
            get { return _patternValue; }
        }

        public string[] ParamNames
        {
            get { return _paramNames; }
        }
    }
}