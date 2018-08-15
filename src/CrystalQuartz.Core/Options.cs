using System;
using System.Collections.Generic;
using CrystalQuartz.Core.Contracts;

namespace CrystalQuartz.Core
{
    using CrystalQuartz.Core.Domain.ObjectTraversing;

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
            TraversingOptions jobDataMapTraversingOptions)
        {
            TimelineSpan = timelineSpan;
            SchedulerEngineResolvers = schedulerEngineResolvers;
            LazyInit = lazyInit;
            CustomCssUrl = customCssUrl;
            FrameworkVersion = frameworkVersion;
            JobDataMapTraversingOptions = jobDataMapTraversingOptions;
        }

        public TimeSpan TimelineSpan { get; }

        public IDictionary<int, Func<ISchedulerEngine>> SchedulerEngineResolvers { get; }

        public bool LazyInit { get; }

        public string CustomCssUrl { get; }

        public string FrameworkVersion { get; }

        public TraversingOptions JobDataMapTraversingOptions { get; }
    }
}