using CrystalQuartz.Core.Contracts;

namespace CrystalQuartz.Application
{
    public interface ISchedulerHostProvider
    {
        SchedulerHost SchedulerHost { get; }
    }
}
