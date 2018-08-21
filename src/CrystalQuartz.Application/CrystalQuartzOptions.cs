using System;

namespace CrystalQuartz.Application
{
    using CrystalQuartz.Core.Domain.ObjectTraversing;

    /// <summary>
    /// Public Crystal Quartz Panel options.
    /// </summary>
    public class CrystalQuartzOptions
    {
        /// <summary>
        /// Gets or sets Panel URL path. Default is "/quartz"
        /// </summary>
        public string Path { get; set; }

        public string CustomCssUrl { get; set; }

        /// <summary>
        /// Gets or sets a flag indicating whether CrystalQuartz Panel should be 
        /// initialized immediately after application start (<code>false</code>) or
        /// after first call of panel services (<code>true</code>).
        /// </summary>
        public bool LazyInit { get; set; } = false;

        public TimeSpan TimelineSpan { get; set; } = TimeSpan.FromMinutes(60);

        /// <summary>
        /// Gets or sets options that control Job Details objects graph display.
        /// </summary>
        public JobDataMapDisplayOptions JobDataMapDisplayOptions { get; set; }

        /// <summary>
        /// Gets or sets options for jobs failure detection.
        /// </summary>
        public ErrorDetectionOptions ErrorDetectionOptions { get; set; }
    }

    public class ConfigurableTraversingOptions
    {
        public int MaxGraphDepth { get; set; } = 3;

        public int MaxPropertiesCount { get; set; } = 10;

        public int MaxEnumerableLength { get; set; } = 10;

        internal TraversingOptions ToTraversingOptions()
        {
            return new TraversingOptions(MaxGraphDepth, MaxPropertiesCount, MaxEnumerableLength);
        }
    }

    public class JobDataMapDisplayOptions : ConfigurableTraversingOptions
    {
    }

    public class ErrorDetectionOptions
    {
        /// <summary>
        /// Gets or sets a sources of error detection.
        /// </summary>
        public ErrorExtractionSource Source { get; set; } = ErrorExtractionSource.UnhandledExceptions | ErrorExtractionSource.JobResult;

        /// <summary>
        /// Gets or sets verbocity level for exception messages.
        /// </summary>
        public ErrorVerbocityLevel VerbocityLevel { get; set; } = ErrorVerbocityLevel.Minimal;

        /// <summary>
        /// Maximum length of exception message to store.
        /// </summary>
        public int ExceptionMessageLengthLimit { get; set; } = 200;

        public JobResultAnalyserOptions JobResultAnalyserOptions { get; set; }
    }

    public abstract class JobResultAnalyserOptions { }

    public class DictionaryJobResultAnalyzerOptions : JobResultAnalyserOptions
    {
        public string SuccessKey { get; set; } = "Success";

        public string FailedKey { get; set; } = "Failed";

        public string ExceptionKey { get; set; } = "Error";
    }

    [Flags]
    public enum ErrorExtractionSource : short
    {
        /// <summary>
        /// Do not extract and store exceptions.
        /// </summary>
        None = 0,

        /// <summary>
        /// Extract only unhandled jobs exceptions reported by scheduler.
        /// </summary>
        UnhandledExceptions = 1,

        /// <summary>
        /// Extract exceptions from job results.
        /// </summary>
        JobResult = 2
    }

    public enum ErrorVerbocityLevel
    {
        /// <summary>
        /// Only mark the fire as failed without any error details.
        /// </summary>
        None,

        /// <summary>
        /// Provide message of top-level exception, trancate it if too long.
        /// </summary>
        Minimal,

        /// <summary>
        /// Provide recursive messages for all the inner exceptions.
        /// </summary>
        Detailed
    }
}