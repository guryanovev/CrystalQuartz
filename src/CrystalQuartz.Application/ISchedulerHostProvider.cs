using CrystalQuartz.Core.Contracts;
using System;
using System.Collections.Generic;
using System.Text;

namespace CrystalQuartz.Application
{
    public interface ISchedulerHostProvider
    {
        SchedulerHost SchedulerHost { get; }
    }
}
