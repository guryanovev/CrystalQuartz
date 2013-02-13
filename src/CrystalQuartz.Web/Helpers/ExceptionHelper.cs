namespace CrystalQuartz.Web.Helpers
{
    using System;
    using System.Text;

    public static class ExceptionHelper
    {
        public static string FullMessage(this Exception exception)
        {
            var messageBuilder = new StringBuilder();
            var currentException = exception;
            while (currentException != null)
            {
                messageBuilder.AppendLine(currentException.Message);
                currentException = currentException.InnerException;
            }
            return messageBuilder.ToString();
        }
    }
}