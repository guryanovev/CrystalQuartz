namespace CrystalQuartz.Core.Utils
{
    using System;

    public static class ExceptionUtils
    {
        public static Exception Unwrap<T>(this Exception exception) where T : Exception
        {
            if (exception == null)
            {
                return null;
            }

            var currentException = exception;

            while (currentException is T)
            {
                if (currentException.InnerException == null)
                {
                    return currentException;
                }

                currentException = currentException.InnerException;
            }

            return currentException;
        }
    }
}