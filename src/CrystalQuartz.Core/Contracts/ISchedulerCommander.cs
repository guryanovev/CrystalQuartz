namespace CrystalQuartz.Core.Contracts
{
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using CrystalQuartz.Core.Domain.TriggerTypes;

    public interface ISchedulerCommander
    {
        /// <summary>
        /// Adds new trigger to existing job.
        /// </summary>
        /// <param name="jobName">existing job name.</param>
        /// <param name="jobGroup">existing job group.</param>
        /// <param name="triggerName">new trigger name or null.</param>
        /// <param name="trigger">trigger type data.</param>
        /// <param name="jobData">trigger job data map (merges with original job's job data map).</param>
        /// <returns>Completeness task.</returns>
        Task ScheduleJob(
            string jobName,
            string jobGroup,
            string? triggerName,
            TriggerType trigger,
            IDictionary<string, object>? jobData);

        /// <summary>
        /// Creates new Job and adds a trigger to it.
        /// </summary>
        /// <param name="jobName">new job name.</param>
        /// <param name="jobGroup">new or existing job name.</param>
        /// <param name="jobType">job type.</param>
        /// <param name="triggerName">new trigger name or null.</param>
        /// <param name="triggerType">trigger type data.</param>
        /// <param name="jobData">job data map.</param>
        /// <returns>Completeness task.</returns>
        Task ScheduleJob(
            string? jobName,
            string? jobGroup,
            Type jobType,
            string? triggerName,
            TriggerType triggerType,
            IDictionary<string, object>? jobData);

        Task DeleteJobGroup(string jobGroup);

        Task DeleteJob(string jobName, string jobGroup);

        Task DeleteTrigger(string triggerName, string triggerGroup);

        Task ExecuteNow(string jobName, string jobGroup);

        Task PauseAllJobs();

        Task PauseJobGroup(string jobGroup);

        Task PauseJob(string jobName, string jobGroup);

        Task PauseTrigger(string triggerName, string triggerGroup);

        Task ResumeAllJobs();

        Task ResumeJobGroup(string jobGroup);

        Task ResumeJob(string jobName, string jobGroup);

        Task ResumeTrigger(string triggerName, string triggerGroup);

        Task StandbyScheduler();

        Task StartScheduler();

        Task StopScheduler();
    }
}