namespace CrystalQuartz.Core.Services.ExceptionTraversing
{
    using System;
    using CrystalQuartz.Core.Domain.Base;

    public class MinimalExceptionTransformer : IExceptionTransformer
    {
        private readonly int _messageLengthLimit;

        public MinimalExceptionTransformer(int messageLengthLimit)
        {
            _messageLengthLimit = messageLengthLimit;
        }

        public ErrorMessage[] Transform(Exception exception)
        {
            var singleException = GetSingleException(exception);

            return new[]
            {
                new ErrorMessage(TruncateIfOverflow(singleException), 0),
            };
        }

        private string TruncateIfOverflow(Exception singleException)
        {
            if (singleException.Message != null && singleException.Message.Length > _messageLengthLimit)
            {
                return singleException.Message.Substring(0, _messageLengthLimit) + "...";
            }

            return singleException.Message;
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