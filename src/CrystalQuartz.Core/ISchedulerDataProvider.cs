using System.Threading.Tasks;

namespace CrystalQuartz.Core
{
    using CrystalQuartz.Core.Domain;
    using Quartz;

    /// <summary>
    /// Translates Quartz.NET entyties to CrystalQuartz objects graph.
    /// </summary>
    public interface ISchedulerDataProvider
    {
        Task<SchedulerData> Data();

        Task<JobDetailsData> GetJobDetailsData(string name, string @group);

        Task<TriggerData> GetTriggerData(TriggerKey key);
    }
}