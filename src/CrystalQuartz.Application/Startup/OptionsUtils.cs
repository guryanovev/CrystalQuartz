namespace CrystalQuartz.Application.Startup
{
    using System;
    using System.Collections.Generic;
    using CrystalQuartz.Core;
    using CrystalQuartz.Core.Contracts;
    using CrystalQuartz.Core.Services.ExceptionTraversing;

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
                (options.JobDataMapDisplayOptions ?? new JobDataMapDisplayOptions()).ToTraversingOptions(),
                (options.ErrorExtractionSource & ErrorExtractionSource.UnhandledExceptions) == ErrorExtractionSource.UnhandledExceptions,
                (options.ErrorExtractionSource & ErrorExtractionSource.JobResult) == ErrorExtractionSource.JobResult,
                CreateExceptionTransformer(options));
        }

        private static IExceptionTransformer CreateExceptionTransformer(CrystalQuartzOptions options)
        {
            return new MinimalExceptionTransformer();
        }
    }
}