namespace CrystalQuartz.Core
{
    using System;
    using System.Collections.Generic;
    using CrystalQuartz.Core.Contracts;
    using CrystalQuartz.Core.Domain.ObjectInput;
    using CrystalQuartz.Core.Domain.ObjectTraversing;
    using CrystalQuartz.Core.Services.ExceptionTraversing;
    using CrystalQuartz.Core.Services.JobResultAnalysing;

    /// <summary>
    /// Internal application options.
    /// </summary>
    public class Options
    {
        public Options(
            TimeSpan timelineSpan,
            IDictionary<int, Func<ISchedulerEngine>> schedulerEngineResolvers,
            bool lazyInit,
            string customCssUrl,
            string frameworkVersion,
            TraversingOptions jobDataMapTraversingOptions,
            bool extractErrorsFromUnhandledExceptions,
            bool extractErrorsFromJobResults,
            IExceptionTransformer exceptionTransformer,
            IJobResultAnalyzer jobResultAnalyzer,
            RegisteredInputType[] jobDataMapInputTypes,
            Type[] allowedJobTypes,
            Action<Exception> errorAction,
            bool isReadOnly)
        {
            TimelineSpan = timelineSpan;
            SchedulerEngineResolvers = schedulerEngineResolvers;
            LazyInit = lazyInit;
            CustomCssUrl = customCssUrl;
            FrameworkVersion = frameworkVersion;
            JobDataMapTraversingOptions = jobDataMapTraversingOptions;
            ExtractErrorsFromUnhandledExceptions = extractErrorsFromUnhandledExceptions;
            ExtractErrorsFromJobResults = extractErrorsFromJobResults;
            ExceptionTransformer = exceptionTransformer;
            JobResultAnalyzer = jobResultAnalyzer;
            JobDataMapInputTypes = jobDataMapInputTypes;
            AllowedJobTypes = allowedJobTypes;
            ErrorAction = errorAction;
            IsReadOnly = isReadOnly;
        }

        public TimeSpan TimelineSpan { get; }

        public IDictionary<int, Func<ISchedulerEngine>> SchedulerEngineResolvers { get; }

        public bool LazyInit { get; }

        public string CustomCssUrl { get; }

        public string FrameworkVersion { get; }

        public TraversingOptions JobDataMapTraversingOptions { get; }

        public bool ExtractErrorsFromUnhandledExceptions { get; }

        public bool ExtractErrorsFromJobResults { get; }

        public IExceptionTransformer ExceptionTransformer { get; }

        public IJobResultAnalyzer JobResultAnalyzer { get; }

        public RegisteredInputType[] JobDataMapInputTypes { get; }

        public Type[] AllowedJobTypes { get; }

        public Action<Exception> ErrorAction { get; }

        public bool IsReadOnly { get; }
    }
}