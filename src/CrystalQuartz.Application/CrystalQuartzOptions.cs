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

        public ErrorExtractionSource ErrorExtractionSource { get; set; } = ErrorExtractionSource.UnhandledExceptions | ErrorExtractionSource.JobResult;
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

    [Flags]
    public enum ErrorExtractionSource : short
    {
        None = 0,
        UnhandledExceptions = 1,
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