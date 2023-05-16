namespace CrystalQuartz.WebFramework.Response
{
    using System;
    using CrystalQuartz.WebFramework.Binding;
    using CrystalQuartz.WebFramework.HttpAbstractions;

    public class ArgumentAwareResponseFiller<TForm> : IResponseFiller
        where TForm : new()
    {
        // in future we might have multiple binders injected
        private static readonly ReflectionBinder Binder = new ReflectionBinder();

        private readonly Func<TForm, IResponseFiller> _action;

        public ArgumentAwareResponseFiller(Func<TForm, IResponseFiller> action)
        {
            _action = action;
        }

        public Response FillResponse(IRequest request)
        {
            var form = Binder.Bind(typeof(TForm), request);

            return _action.Invoke((TForm)form).FillResponse(request);
        }
    }
}