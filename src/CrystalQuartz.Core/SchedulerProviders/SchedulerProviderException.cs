namespace CrystalQuartz.Core.SchedulerProviders
{
    using System;
    using System.Collections.Specialized;
    using System.Text;

    public class SchedulerProviderException : Exception
    {
        public SchedulerProviderException(string message, NameValueCollection properties) : this(message, null, properties)
        {
        }

        public SchedulerProviderException(string message, Exception innerException, NameValueCollection properties)
            : base(message, innerException)
        {
            SchedulerInitialProperties = properties;
        }

        public NameValueCollection SchedulerInitialProperties { get; private set; }
    }
}