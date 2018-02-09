using System.Web;
using System.Web.Mvc;

namespace Demo.Quartz3.Web.Owin
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }
    }
}
