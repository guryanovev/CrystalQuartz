namespace CrystalQuartz.Application.Startup
{
    using System;
    using System.Collections.Generic;
    using CrystalQuartz.Core;
    using CrystalQuartz.Core.Contracts;
    using CrystalQuartz.Core.Services.ExceptionTraversing;
    using CrystalQuartz.Core.Services.JobResultAnalysing;

    public static class OptionsUtils
    {
        public static Options ToRuntimeOptions(
            this CrystalQuartzOptions options,
            IDictionary<int, Func<ISchedulerEngine>> schedulerEngineResolvers, 
            string frameworkVersion)
        {
            ErrorDetectionOptions errorDetectionOptions = options.ErrorDetectionOptions ?? new ErrorDetectionOptions();
            ErrorExtractionSource errorExtractionSource = errorDetectionOptions.Source;

            var extractErrorsFromJobResults = (errorExtractionSource & ErrorExtractionSource.JobResult) == ErrorExtractionSource.JobResult;

            IJobResultAnalyser jobResultAnalyser = null;
            if (extractErrorsFromJobResults)
            {
                jobResultAnalyser = CreateJobResultAnalyzer(errorDetectionOptions.JobResultAnalyserOptions ?? new DictionaryJobResultAnalyzerOptions());
            }

            return new Options(
                options.TimelineSpan,
                schedulerEngineResolvers,
                options.LazyInit,
                options.CustomCssUrl,
                frameworkVersion,
                (options.JobDataMapDisplayOptions ?? new JobDataMapDisplayOptions()).ToTraversingOptions(),
                (errorExtractionSource & ErrorExtractionSource.UnhandledExceptions) == ErrorExtractionSource.UnhandledExceptions,
                extractErrorsFromJobResults,
                CreateExceptionTransformer(errorDetectionOptions),
                jobResultAnalyser);
        }

        private static IJobResultAnalyser CreateJobResultAnalyzer(JobResultAnalyserOptions options)
        {
            if (options is DictionaryJobResultAnalyzerOptions dictionaryOptions)
            {
                return new DictionaryJobResultAnalyser(
                    dictionaryOptions.FailedKey, 
                    dictionaryOptions.SuccessKey, 
                    dictionaryOptions.ExceptionKey);
            }

            throw new Exception("Unsupported job result analyser options");
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
                    return new DetailedExceptionTransformer();
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }
    }
}