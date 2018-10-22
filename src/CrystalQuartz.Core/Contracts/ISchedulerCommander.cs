using CrystalQuartz.Core.Domain.TriggerTypes;

namespace CrystalQuartz.Core.Contracts
{
    using System.Collections.Generic;

    public interface ISchedulerCommander
    {
        void TriggerJob(
            string jobName, 
            string jobGroup, 
            string triggerName, 
            TriggerType trigger,
            IDictionary<string, object> jobData);

        void DeleteJobGroup(string jobGroup);
        void DeleteJob(string jobName, string jobGroup);
        void DeleteTrigger(string triggerName, string triggerGroup);

        void ExecuteNow(string jobName, string jobGroup);

        void PauseAllJobs();
        void PauseJobGroup(string jobGroup);
        void PauseJob(string jobName, string jobGroup);
        void PauseTrigger(string triggerName, string triggerGroup);

        void ResumeAllJobs();
        void ResumeJobGroup(string jobGroup);
        void ResumeJob(string jobName, string jobGroup);
        void ResumeTrigger(string triggerName, string triggerGroup);

        void StandbyScheduler();
        void StartScheduler();
        void StopScheduler();
    }
}