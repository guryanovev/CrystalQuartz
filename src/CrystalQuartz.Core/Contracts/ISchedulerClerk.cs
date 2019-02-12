using CrystalQuartz.Core.Domain;
using CrystalQuartz.Core.Domain.Activities;

namespace CrystalQuartz.Core.Contracts
{
    using System;
    using System.Collections.Generic;

    /// <summary>
    /// Provides read-only access to scheduler data in terms of internal domain model.
    /// </summary>
    public interface ISchedulerClerk
    {
        /// <summary>
        /// Gets full scheduler objects graph including JobGroups, Groups and Triggers.
        /// </summary>
        /// <returns></returns>
        SchedulerData GetSchedulerData();

        /// <summary>
        /// Gets job details info
        /// </summary>
        /// <param name="name">Job name</param>
        /// <param name="group">Job group</param>
        /// <returns></returns>
        JobDetailsData GetJobDetailsData(string name, string group);

        SchedulerDetails GetSchedulerDetails();

        TriggerDetailsData GetTriggerDetailsData(string name, string group);

        IEnumerable<Type> GetScheduledJobTypes();
    }
}