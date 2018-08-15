namespace CrystalQuartz.Application.Startup
{
    using System;
    using System.Collections.Generic;
    using CrystalQuartz.Core;
    using CrystalQuartz.Core.Contracts;

    public static class OptionsUtils
    {
        public static Options ToRuntimeOptions(
            this CrystalQuartzOptions options,
            IDictionary<int, Func<ISchedulerEngine>> schedulerEngineResolvers, 
            string frameworkVersion)
        {
            return new Options(
                options.TimelineSpan,
                schedulerEngineResolvers,
                options.LazyInit,
                options.CustomCssUrl,
                frameworkVersion,
                (options.JobDataMapDisplayOptions ?? new JobDataMapDisplayOptions()).ToTraversingOptions());
        }
    }
}