using CrystalQuartz.Core.Contracts;
using CrystalQuartz.Core.Quartz2;
using CrystalQuartz.Core.Quartz3;
using System;
using System.Collections.Generic;

namespace CrystalQuartz.AspNetCore
{
    public static class SchedulerEngineProviders
    {
        public static readonly IDictionary<int, Func<ISchedulerEngine>> SchedulerEngineResolvers = new Dictionary<int, Func<ISchedulerEngine>>
        {
            { 2, () => new Quartz2SchedulerEngine() },
            { 3, () => new Quartz3SchedulerEngine() }
        };
    }
}