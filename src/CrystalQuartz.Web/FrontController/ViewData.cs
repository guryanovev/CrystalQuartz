namespace CrystalQuartz.Web.FrontController
{
    using System.Collections.Generic;

    public class ViewData
    {
        public ViewData(string viewName)
        {
            ViewName = viewName;
            Data = new Dictionary<string, object>();
        }

        public string ViewName
        {
            get; private set;
        }

        public IDictionary<string, object> Data { get; private set; }
    }
}