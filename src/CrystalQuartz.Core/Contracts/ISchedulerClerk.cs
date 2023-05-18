namespace CrystalQuartz.Core.Contracts
{
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using CrystalQuartz.Core.Domain;

    /// <summary>
    /// Provides read-only access to scheduler data in terms of internal domain model.
    /// </summary>
    public interface ISchedulerClerk
    {
        /// <summary>
        /// Gets full scheduler objects graph including JobGroups, Groups and Triggers.
        /// </summary>
        /// <returns>Scheduler data.</returns>
        Task<SchedulerData> GetSchedulerData();

        /// <summary>
        /// Gets job details info.
        /// </summary>
        /// <param name="name">Job name.</param>
        /// <param name="group">Job group.</param>
        /// <returns>Job details data.</returns>
        Task<JobDetailsData?> GetJobDetailsData(string name, string group);

        Task<SchedulerDetails> GetSchedulerDetails();

        Task<TriggerDetailsData?> GetTriggerDetailsData(string name, string group);

        Task<IEnumerable<Type>> GetScheduledJobTypes();
    }
}