using CrystalQuartz.WebFramework.HttpAbstractions;

namespace CrystalQuartz.WebFramework.AspNetCore
{
    public class AspNetCoreRequest : IRequest
    {
        public string this[string key]
        {
            get { return "todo"; }
        }
    }
}