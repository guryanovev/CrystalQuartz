namespace CrystalQuartz.WebFramework.Routing
{
    using CrystalQuartz.WebFramework.HttpAbstractions;

    public class SingleParamRequestMatcher : IRequestMatcher
    {
        private readonly string _parameter;

        private readonly string _value;

        public SingleParamRequestMatcher(string parameter, string value)
        {
            _parameter = parameter;
            _value = value;
        }

        public bool CanProcessRequest(IRequest request)
        {
            var value = request[_parameter];
            if (string.IsNullOrEmpty(value))
            {
                return false;
            }

            return value == _value;
        }
    }
}