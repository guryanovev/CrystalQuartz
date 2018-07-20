using Microsoft.AspNetCore.Mvc;

namespace CqSamples.Quartz3.AspNetCore.Simple.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
