namespace CrystalQuartz.Core.Domain
{
    using System;
    using System.Collections.Generic;

    public class JobDetails
    {
        public string Description { get; set; }

        public bool ConcurrentExecutionDisallowed { get; set; }

        public bool PersistJobDataAfterExecution { get; set; }

        public bool RequestsRecovery { get; set; }

        public bool Durable { get; set; }

        public Type JobType { get; set; }
    }

    public class Property
    {
        private readonly string _title;
        private readonly string _typeTypeCode;
        private readonly Type _type;
        private readonly object _value;

        public Property(string title, Type type, object value, string typeTypeCode)
        {
            _title = title;
            _type = type;
            _value = value;
            _typeTypeCode = typeTypeCode;
        }

        public string Title
        {
            get { return _title; }
        }

        public Type Type
        {
            get { return _type; }
        }

        public object Value
        {
            get { return _value; }
        }

        public string TypeCode
        {
            get { return _typeTypeCode; }
        }
    }

    public class JobDetailsData
    {
        private readonly JobDetails _jobDetails;
        private readonly Property[] _properties;

        public JobDetailsData(JobDetails jobDetails, Property[] properties)
        {
            _jobDetails = jobDetails;
            _properties = properties;
        }

        public JobDetails JobDetails
        {
            get { return _jobDetails; }
        }

        public Property[] Properties
        {
            get { return _properties; }
        }

//        public JobDetailsData()
//        {
//            JobDataMap = new Dictionary<object, object>();
//            JobProperties = new Dictionary<string, object>(); 
//        }
//
//        public JobData PrimaryData { get; set; }
//
//        public IDictionary<object, object> JobDataMap { get; private set; }
//
//        public IDictionary<string, object> JobProperties { get; private set; }
    }
}