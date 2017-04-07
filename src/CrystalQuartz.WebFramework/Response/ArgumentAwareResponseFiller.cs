namespace CrystalQuartz.WebFramework.Response
{
    using System;
    using CrystalQuartz.WebFramework.HttpAbstractions;

    public class ArgumentAwareResponseFiller<TForm>: IResponseFiller where TForm : new()
    {
        private readonly Func<TForm, IResponseFiller> _action;

        public ArgumentAwareResponseFiller(Func<TForm, IResponseFiller> action)
        {
            _action = action;
        }

        public Response FillResponse(IRequest request)
        {
            var form = new TForm();
            foreach (var propertyInfo in form.GetType().GetProperties())
            {
                if (propertyInfo.CanWrite)
                {
                    object formPropertyValue = GetFormPropertyValue(propertyInfo.Name, request);
                    if (formPropertyValue != null)
                    {
                        if (propertyInfo.PropertyType == typeof(string))
                        {
                            propertyInfo.SetValue(form, formPropertyValue, null);
                        }
                        else
                        {
                            propertyInfo.SetValue(form, Convert.ChangeType(formPropertyValue, propertyInfo.PropertyType), null);
                        }
                    }
                }
            }

            return _action.Invoke(form).FillResponse(request);
        }

        private object GetFormPropertyValue(string name, IRequest request)
        {
            return request[name];
        }
    }
}