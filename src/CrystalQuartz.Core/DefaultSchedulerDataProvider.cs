namespace CrystalQuartz.Core
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using CrystalQuartz.Core.Domain;
    using CrystalQuartz.Core.SchedulerProviders;
    using CrystalQuartz.Core.Utils;
    using Quartz;
    using Quartz.Impl.Matchers;

    public class DefaultSchedulerDataProvider : ISchedulerDataProvider
    {
        private readonly static TriggerTypeExtractor TriggerTypeExtractor = new TriggerTypeExtractor();

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
                               JobsExecuted = metadata.NumberOfJobsExecuted,
                               RunningSince = metadata.RunningSince.ToDateTime(),
                               SchedulerType = metadata.SchedulerType,
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

            IJobDetail job;
            JobDetailsData detailsData = new JobDetailsData
            {
                PrimaryData = GetJobData(scheduler, name, group)
            };

            try
            {
                job = scheduler.GetJobDetail(new JobKey(name, @group));
            }
            catch (Exception)
            {
                // GetJobDetail method throws exceptions for remote 
                // scheduler in case when JobType requires an external 
                // assembly to be referenced.
                // see https://github.com/guryanovev/CrystalQuartz/issues/16 for details

                detailsData.JobDataMap.Add("Data", "Not available for remote scheduler");
                detailsData.JobProperties.Add("Data", "Not available for remote scheduler");

                return detailsData;
            }
            
            if (job == null)
            {
                return null;
            }

            foreach (var key in job.JobDataMap.Keys)
            {
                var jobData = job.JobDataMap[key];
                detailsData.JobDataMap.Add(key, jobData);
            }

            detailsData.JobProperties.Add("Description", job.Description);
            detailsData.JobProperties.Add("Full name", job.Key.Name);
            detailsData.JobProperties.Add("Job type", GetJobType(job));
            detailsData.JobProperties.Add("Durable", job.Durable);
            detailsData.JobProperties.Add("ConcurrentExecutionDisallowed", job.ConcurrentExecutionDisallowed);
            detailsData.JobProperties.Add("PersistJobDataAfterExecution", job.PersistJobDataAfterExecution);
            detailsData.JobProperties.Add("RequestsRecovery", job.RequestsRecovery);

            return detailsData;
        }

        private static string GetJobType(IJobDetail job)
        {
            return job.JobType.Name;
        }

        public TriggerData GetTriggerData(TriggerKey key)
        {
            var scheduler = _schedulerProvider.Scheduler;
            if (scheduler.IsShutdown)
            {
                return null;
            }

            ITrigger trigger = scheduler.GetTrigger(key);
            if (trigger == null)
            {
                return null;
            }

            return GetTriggerData(scheduler, trigger);
        }

        public SchedulerStatus GetSchedulerStatus(IScheduler scheduler)
        {
            if (scheduler.IsShutdown)
            {
                return SchedulerStatus.Shutdown;
            }

            var jobGroupNames = scheduler.GetJobGroupNames();
            if (jobGroupNames == null || jobGroupNames.Count == 0)
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
            var state = scheduler.GetTriggerState(new TriggerKey(triggerName, triggerGroup));
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

        private static ActivityStatus GetTriggerStatus(ITrigger trigger, IScheduler scheduler)
        {
            return GetTriggerStatus(trigger.Key.Name, trigger.Key.Group, scheduler);
            //return GetTriggerStatus(trigger.Name, trigger.Group, scheduler);
        }

        private static IList<TriggerGroupData> GetTriggerGroups(IScheduler scheduler)
        {
            var result = new List<TriggerGroupData>();
            if (!scheduler.IsShutdown)
            {
                foreach (var groupName in scheduler.GetTriggerGroupNames())
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
                foreach (var groupName in scheduler.GetJobGroupNames())
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

            foreach (var jobKey in scheduler.GetJobKeys(GroupMatcher<JobKey>.GroupEquals(groupName)))
            {
                result.Add(GetJobData(scheduler, jobKey.Name, groupName));
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
            return scheduler
                .GetTriggersOfJob(new JobKey(jobName, @group))
                .Select(trigger => GetTriggerData(scheduler, trigger))
                .ToList();
        }

        private static TriggerData GetTriggerData(IScheduler scheduler, ITrigger trigger)
        {
            return new TriggerData(trigger.Key.Name, GetTriggerStatus(trigger, scheduler))
            {
                GroupName = trigger.Key.Group,
                StartDate = trigger.StartTimeUtc.DateTime,
                EndDate = trigger.EndTimeUtc.ToDateTime(),
                NextFireDate = trigger.GetNextFireTimeUtc().ToDateTime(),
                PreviousFireDate = trigger.GetPreviousFireTimeUtc().ToDateTime(),
                TriggerType = TriggerTypeExtractor.GetFor(trigger)
            };
        }
    }
}