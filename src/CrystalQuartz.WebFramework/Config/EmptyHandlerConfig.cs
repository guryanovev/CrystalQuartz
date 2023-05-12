namespace CrystalQuartz.WebFramework.Config
{
    using System.Collections.Generic;
    using CrystalQuartz.WebFramework.Request;

    public class EmptyHandlerConfig : AbstractHandlerConfig
    {
        public EmptyHandlerConfig(AppContext context)
            : base(context)
        {
        }

        public override IEnumerable<IRequestHandler> Handlers
        {
            get { yield break; }
        }
    }
}