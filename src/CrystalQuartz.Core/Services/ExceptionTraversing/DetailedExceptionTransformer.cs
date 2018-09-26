namespace CrystalQuartz.Core.Services.ExceptionTraversing
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using CrystalQuartz.Core.Domain.Base;

    public class DetailedExceptionTransformer : IExceptionTransformer
    {
        public ErrorMessage[] Transform(Exception exception)
        {
            IList<ErrorMessage> result = new List<ErrorMessage>();

            ProcessException(exception, 0, result);

            return result.ToArray();
        }

        private void ProcessException(Exception exception, int level, IList<ErrorMessage> results)
        {
            results.Add(new ErrorMessage(exception.Message, level));

            if (exception is AggregateException aggregateException)
            {
                foreach (var innerException in aggregateException.InnerExceptions)
                {
                    ProcessException(innerException, level + 1, results);
                }
            }
            else
            {
                if (exception.InnerException != null)
                {
                    ProcessException(exception.InnerException, level + 1, results);
                }
            }
        }
    }
}