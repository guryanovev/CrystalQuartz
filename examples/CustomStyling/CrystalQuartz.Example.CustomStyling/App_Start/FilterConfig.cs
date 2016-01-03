using System.Web;
using System.Web.Mvc;

namespace CrystalQuartz.Example.CustomStyling
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }
    }
}
