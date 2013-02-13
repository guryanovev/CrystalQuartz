namespace CrystalQuartz.Web.FrontController.ViewRendering
{
    using System.Collections.Generic;
    using System.IO;

    public interface IViewEngine
    {
        void Init();

        void RenderView(string name, IDictionary<string, object> data, Stream outputStream);
    }
}