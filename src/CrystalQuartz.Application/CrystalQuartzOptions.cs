using System;

namespace CrystalQuartz.Application
{
    public class CrystalQuartzOptions
    {
        public string Path { get; set; }

        public string CustomCssUrl { get; set; }

        /// <summary>
        /// Gets or sets a flag indicating whether CrystalQuartz Panel should be 
        /// initialized immediately after application start (<code>false</code>) or
        /// after first call of panel services (<code>true</code>).
        /// </summary>
        public bool LazyInit { get; set; } = false;

        public TimeSpan TimelineSpan { get; set; } = TimeSpan.FromMinutes(60);
    }
}