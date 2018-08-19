namespace CrystalQuartz.Core.Services.ExceptionTraversing
{
    using System;
    using CrystalQuartz.Core.Domain.Base;

    public class MinimalExceptionTransformer : IExceptionTransformer
    {
        public ErrorMessage[] Transform(Exception exception)
        {
            var singleException = GetSingleException(exception);

            return new ErrorMessage[1]
            {
                new ErrorMessage(singleException.Message, 0)
            };
        }

        private Exception GetSingleException(Exception exception)
        {
            if (exception is AggregateException aggregateException)
            {
                Exception target = aggregateException.Flatten();
                if (target.InnerException != null)
                {
                    target = target.InnerException;
                }

                return target;
            }

            return exception;
        }
    }
}