namespace CrystalQuartz.Web
{
    using System;
    using System.Collections.Generic;
    using CrystalQuartz.Core.Contracts;
    using CrystalQuartz.Core.Quartz2;

#if NET452_OR_GREATER
    using CrystalQuartz.Core.Quartz3;
#endif

    public static class SchedulerEngineProviders
    {
        public static readonly IDictionary<int, Func<ISchedulerEngine>> SchedulerEngineResolvers = new Dictionary<int, Func<ISchedulerEngine>>
        {
            { 2, () => new Quartz2SchedulerEngine() },
#if NET452_OR_GREATER
            { 3, () => new Quartz3SchedulerEngine() },
#endif
        };
    }
}