namespace CrystalQuartz.Web.FrontController.ViewRendering
{
    using System.Collections.Generic;
    using System.IO;
    using Commons.Collections;
    using NVelocity;
    using NVelocity.App;

    public class VelocityViewEngine : IViewEngine
    {
        private VelocityEngine _velocity;

        public void Init()
        {
            _velocity = new VelocityEngine();

            var properties = new ExtendedProperties();
            properties.AddProperty(
                "resource.loader", 
                "assembly");
            properties.AddProperty(
                "assembly.resource.loader.class",
                "NVelocity.Runtime.Resource.Loader.AssemblyResourceLoader, NVelocity");
            properties.AddProperty(
                "assembly.resource.loader.assembly", 
                "CrystalQuartz.Web");

            _velocity.Init(properties);
        }

        public void RenderView(string name, IDictionary<string, object> data, Stream outputStream)
        {
            var template = _velocity.GetTemplate(string.Format("CrystalQuartz.Web.Templates.{0}.vm", name));
            var context = new VelocityContext();
            foreach (var pair in data)
            {
                context.Put(pair.Key, pair.Value);
            }

            using (var writer = new StreamWriter(outputStream))
            {
                template.Merge(context, writer);
            }
        }
    }
}