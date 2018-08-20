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
            ErrorDetectionOptions errorDetectionOptions = options.ErrorDetectionOptions ?? new ErrorDetectionOptions();
            ErrorExtractionSource errorExtractionSource = errorDetectionOptions.Source;

            return new Options(
                options.TimelineSpan,
                schedulerEngineResolvers,
                options.LazyInit,
                options.CustomCssUrl,
                frameworkVersion,
                (options.JobDataMapDisplayOptions ?? new JobDataMapDisplayOptions()).ToTraversingOptions(),
                (errorExtractionSource & ErrorExtractionSource.UnhandledExceptions) == ErrorExtractionSource.UnhandledExceptions,
                (errorExtractionSource & ErrorExtractionSource.JobResult) == ErrorExtractionSource.JobResult,
                CreateExceptionTransformer(errorDetectionOptions));
        }

        private static IExceptionTransformer CreateExceptionTransformer(ErrorDetectionOptions options)
        {
            switch (options.VerbocityLevel)
            {
                case ErrorVerbocityLevel.None:
                    return new NoopExceptionTransformer();
                case ErrorVerbocityLevel.Minimal:
                    return new MinimalExceptionTransformer(options.ExceptionMessageLengthLimit);
                case ErrorVerbocityLevel.Detailed:
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }
    }
}