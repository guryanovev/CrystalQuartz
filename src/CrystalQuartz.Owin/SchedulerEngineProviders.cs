using System;
using System.Collections.Generic;
using CrystalQuartz.Core.Contracts;
using CrystalQuartz.Core.Quartz2;

namespace CrystalQuartz.Owin
{
    public static class SchedulerEngineProviders
    {
        public static readonly IDictionary<int, Func<ISchedulerEngine>> SchedulerEngineResolvers = new Dictionary<int, Func<ISchedulerEngine>>
        {
            { 2, () => new Quartz2SchedulerEngine() }
        };
    }
}