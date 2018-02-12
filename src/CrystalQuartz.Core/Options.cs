using System;

namespace CrystalQuartz.Core
{
    public class Options
    {
        public Options(TimeSpan timelineSpan)
        {
            TimelineSpan = timelineSpan;
        }

        public TimeSpan TimelineSpan { get; }
    }
}