namespace CrystalQuartz.WebFramework.Response
{
    using System;
    using System.Web;

    public class ArgumentAwareResponseFiller<TForm>: IResponseFiller where TForm : new()
    {
        private readonly Func<TForm, IResponseFiller> _action;

        public ArgumentAwareResponseFiller(Func<TForm, IResponseFiller> action)
        {
            _action = action;
        }

        public void FillResponse(HttpResponseBase response, HttpContextBase context)
        {
            var form = new TForm();
            foreach (var propertyInfo in form.GetType().GetProperties())
            {
                if (propertyInfo.CanWrite)
                {
                    propertyInfo.SetValue(form, GetFormPropertyValue(propertyInfo.Name, context.Request), null);
                }
            }

            _action.Invoke(form).FillResponse(response, context);
        }

        private object GetFormPropertyValue(string name, HttpRequestBase request)
        {
            return request.Params[name];
        }
    }
}