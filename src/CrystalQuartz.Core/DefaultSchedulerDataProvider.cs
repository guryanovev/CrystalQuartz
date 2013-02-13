namespace CrystalQuartz.Core
{
    using System;
    using System.Collections.Generic;
    using Domain;
    using Quartz;
    using SchedulerProviders;

    public class DefaultSchedulerDataProvider : ISchedulerDataProvider
    {
        private readonly ISchedulerProvider _schedulerProvider;

        public DefaultSchedulerDataProvider(ISchedulerProvider schedulerProvider)
        {
            _schedulerProvider = schedulerProvider;
        }

        public SchedulerData Data
        {
            get
            {
                var scheduler = _schedulerProvider.Scheduler;
                var metadata = scheduler.GetMetaData();
                return new SchedulerData
                           {
                               Name = scheduler.SchedulerName,
                               InstanceId = scheduler.SchedulerInstanceId,
                               JobGroups = GetJobGroups(scheduler),
                               TriggerGroups = GetTriggerGroups(scheduler),
                               Status = GetSchedulerStatus(scheduler),
                               IsRemote = metadata.SchedulerRemote,
                               JobsExecuted = metadata.NumJobsExecuted,
                               RunningSince = metadata.RunningSince,
                               SchedulerType = metadata.SchedulerType
                           };
            }
        }

        public JobDetailsData GetJobDetailsData(string name, string group)
        {
            var scheduler = _schedulerProvider.Scheduler;

            if (scheduler.IsShutdown)
            {
                return null;
            }

            var job = scheduler.GetJobDetail(name, group);
            if (job == null)
            {
                return null;
            }

            var detailsData = new JobDetailsData
            {
               PrimaryData = GetJobData(scheduler, name, group)
            };

            foreach (var key in job.JobDataMap.Keys)
            {
                detailsData.JobDataMap.Add(key, job.JobDataMap[key]);
            }

            detailsData.JobProperties.Add("Description", job.Description);
            detailsData.JobProperties.Add("Full name", job.FullName);
            detailsData.JobProperties.Add("Job type", job.JobType);
            detailsData.JobProperties.Add("Durable", job.Durable);
            detailsData.JobProperties.Add("Volatile", job.Volatile);

            return detailsData;
        }

        public SchedulerStatus GetSchedulerStatus(IScheduler scheduler)
        {
            if (scheduler.IsShutdown)
            {
                return SchedulerStatus.Shutdown;
            }

            if (scheduler.JobGroupNames == null || scheduler.JobGroupNames.Length == 0)
            {
                return SchedulerStatus.Empty;
            }

            if (scheduler.IsStarted)
            {
                return SchedulerStatus.Started;
            }

            return SchedulerStatus.Ready;
        }

        private static ActivityStatus GetTriggerStatus(string triggerName, string triggerGroup, IScheduler scheduler)
        {
            var state = scheduler.GetTriggerState(triggerName, triggerGroup);
            switch (state)
            {
                case TriggerState.Paused:
                    return ActivityStatus.Paused;
                case TriggerState.Complete:
                    return ActivityStatus.Complete;
                default:
                    return ActivityStatus.Active;
            }
        }

        private static ActivityStatus GetTriggerStatus(Trigger trigger, IScheduler scheduler)
        {
            return GetTriggerStatus(trigger.Name, trigger.Group, scheduler);
        }

        private static IList<TriggerGroupData> GetTriggerGroups(IScheduler scheduler)
        {
            var result = new List<TriggerGroupData>();
            if (!scheduler.IsShutdown)
            {
                foreach (var groupName in scheduler.TriggerGroupNames)
                {
                    var data = new TriggerGroupData(groupName);
                    data.Init();
                    result.Add(data);
                }
            }

            return result;
        }

        private static IList<JobGroupData> GetJobGroups(IScheduler scheduler)
        {
            var result = new List<JobGroupData>();

            if (!scheduler.IsShutdown)
            {
                foreach (var groupName in scheduler.JobGroupNames)
                {
                    var groupData = new JobGroupData(
                        groupName,
                        GetJobs(scheduler, groupName));
                    groupData.Init();
                    result.Add(groupData);
                }
            }

            return result;
        }

        private static IList<JobData> GetJobs(IScheduler scheduler, string groupName)
        {
            var result = new List<JobData>();

            foreach (var jobName in scheduler.GetJobNames(groupName))
            {
                result.Add(GetJobData(scheduler, jobName, groupName));
            }

            return result;
        }

        private static JobData GetJobData(IScheduler scheduler, string jobName, string group)
        {
            var jobData = new JobData(jobName, group, GetTriggers(scheduler, jobName, group));
            jobData.Init();
            return jobData;
        }

        private static IList<TriggerData> GetTriggers(IScheduler scheduler, string jobName, string group)
        {
            var result = new List<TriggerData>();

            foreach (var trigger in scheduler.GetTriggersOfJob(jobName, group))
            {
                var data = new TriggerData(trigger.Name, GetTriggerStatus(trigger, scheduler))
                {
                    StartDate = trigger.StartTimeUtc,
                    EndDate = trigger.EndTimeUtc,
                    NextFireDate = trigger.GetNextFireTimeUtc(),
                    PreviousFireDate = trigger.GetPreviousFireTimeUtc()
                };
                result.Add(data);
            }

            return result;
        }
    }
}