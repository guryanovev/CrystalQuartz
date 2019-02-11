using System;
using System.Collections.Generic;
using CrystalQuartz.Core.Contracts;

namespace CrystalQuartz.Core
{
    using CrystalQuartz.Core.Domain.ObjectInput;
    using CrystalQuartz.Core.Domain.ObjectTraversing;
    using CrystalQuartz.Core.Services.ExceptionTraversing;
    using CrystalQuartz.Core.Services.JobResultAnalysing;

    /// <summary>
    /// Internal application options.
    /// </summary>
    public class Options
    {
        public Options(TimeSpan timelineSpan,
            IDictionary<int, Func<ISchedulerEngine>> schedulerEngineResolvers,
            bool lazyInit,
            string customCssUrl,
            string frameworkVersion,
            TraversingOptions jobDataMapTraversingOptions,
            bool extractErrorsFromUnhandledExceptions,
            bool extractErrorsFromJobResults,
            IExceptionTransformer exceptionTransformer, 
            IJobResultAnalyser jobResultAnalyser, 
            RegisteredInputType[] jobDataMapInputTypes, Type[] allowedJobTypes)
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
            JobResultAnalyser = jobResultAnalyser;
            JobDataMapInputTypes = jobDataMapInputTypes;
            AllowedJobTypes = allowedJobTypes;
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

        public IJobResultAnalyser JobResultAnalyser { get; }

        public RegisteredInputType[] JobDataMapInputTypes { get; }

        public Type[] AllowedJobTypes { get; }
    }
}