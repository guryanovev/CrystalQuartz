namespace CrystalQuartz.Core
{
    using CrystalQuartz.Core.Domain;
    using Quartz;

    /// <summary>
    /// Translates Quartz.NET entyties to CrystalQuartz objects graph.
    /// </summary>
    public interface ISchedulerDataProvider
    {
        SchedulerData Data { get; }

        JobDetailsData GetJobDetailsData(string name, string group);

        SchedulerDetails GetSchedulerDetails();

        TriggerData GetTriggerData(TriggerKey key);
    }
}