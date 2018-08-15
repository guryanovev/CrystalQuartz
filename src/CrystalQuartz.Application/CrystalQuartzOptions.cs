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
}