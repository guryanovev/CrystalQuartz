using System.Threading.Tasks;

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

        public async Task<SchedulerData> Data()
        {
                var scheduler = await _schedulerProvider.Scheduler().ConfigureAwait(false);
                var metadata = await scheduler.GetMetaData().ConfigureAwait(false);
                return new SchedulerData
                           {
                               Name = scheduler.SchedulerName,
                               InstanceId = scheduler.SchedulerInstanceId,
                               JobGroups = await GetJobGroups(scheduler).ConfigureAwait(false),
                               TriggerGroups = await GetTriggerGroups(scheduler).ConfigureAwait(false),
                               Status = await GetSchedulerStatus(scheduler).ConfigureAwait(false),
                               IsRemote = metadata.SchedulerRemote,
                               JobsExecuted = metadata.NumberOfJobsExecuted,
                               JobsTotal = (await scheduler.GetJobKeys(GroupMatcher<JobKey>.AnyGroup()).ConfigureAwait(false)).Count,
                               RunningSince = metadata.RunningSince.ToDateTime(),
                               SchedulerType = metadata.SchedulerType,
                           };
        }

        public async Task<JobDetailsData> GetJobDetailsData(string name, string @group)
        {
            var scheduler = await _schedulerProvider.Scheduler().ConfigureAwait(false);
            if (scheduler.IsShutdown)
            {
                return null;
            }

            IJobDetail job;
            JobDetailsData detailsData = new JobDetailsData
            {
                PrimaryData = await GetJobData(scheduler, name, @group).ConfigureAwait(false)
            };

            try
            {
                job = await scheduler.GetJobDetail(new JobKey(name, @group)).ConfigureAwait(false);
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

        public async Task<TriggerData> GetTriggerData(TriggerKey key)
        {
            var scheduler = await _schedulerProvider.Scheduler().ConfigureAwait(false);
            if (scheduler.IsShutdown)
            {
                return null;
            }

            ITrigger trigger = await scheduler.GetTrigger(key).ConfigureAwait(false);
            if (trigger == null)
            {
                return null;
            }

            return await GetTriggerData(scheduler, trigger).ConfigureAwait(false);
        }

        public async Task<SchedulerStatus> GetSchedulerStatus(IScheduler scheduler)
        {
            if (scheduler.IsShutdown)
            {
                return SchedulerStatus.Shutdown;
            }

            var jobGroupNames = await scheduler.GetJobGroupNames().ConfigureAwait(false);
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

        private static async Task<ActivityStatus> GetTriggerStatus(string triggerName, string triggerGroup, IScheduler scheduler)
        {
            var state = await scheduler.GetTriggerState(new TriggerKey(triggerName, triggerGroup)).ConfigureAwait(false);
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

        private static async Task<ActivityStatus> GetTriggerStatus(ITrigger trigger, IScheduler scheduler)
        {
            return await GetTriggerStatus(trigger.Key.Name, trigger.Key.Group, scheduler).ConfigureAwait(false);
            //return GetTriggerStatus(trigger.Name, trigger.Group, scheduler);
        }

        private static async Task<IList<TriggerGroupData>> GetTriggerGroups(IScheduler scheduler)
        {
            var result = new List<TriggerGroupData>();
            if (!scheduler.IsShutdown)
            {
                foreach (var groupName in await scheduler.GetTriggerGroupNames().ConfigureAwait(false))
                {
                    var data = new TriggerGroupData(groupName);
                    data.Init();
                    result.Add(data);
                }
            }

            return result;
        }

        private static async Task<IList<JobGroupData>> GetJobGroups(IScheduler scheduler)
        {
            var result = new List<JobGroupData>();

            if (!scheduler.IsShutdown)
            {
                foreach (var groupName in await scheduler.GetJobGroupNames().ConfigureAwait(false))
                {
                    var groupData = new JobGroupData(
                        groupName,
                        await GetJobs(scheduler, groupName).ConfigureAwait(false));
                    groupData.Init();
                    result.Add(groupData);
                }
            }

            return result;
        }

        private static async Task<IList<JobData>> GetJobs(IScheduler scheduler, string groupName)
        {
            var result = new List<JobData>();

            foreach (var jobKey in await scheduler.GetJobKeys(GroupMatcher<JobKey>.GroupEquals(groupName)).ConfigureAwait(false))
            {
                result.Add(await GetJobData(scheduler, jobKey.Name, groupName).ConfigureAwait(false));
            }

            return result;
        }

        private static async Task<JobData> GetJobData(IScheduler scheduler, string jobName, string @group)
        {
            var jobData = new JobData(jobName, group, await GetTriggers(scheduler, jobName, @group).ConfigureAwait(false));
            jobData.Init();
            return jobData;
        }

        private static async Task<IList<TriggerData>> GetTriggers(IScheduler scheduler, string jobName, string @group)
        {
            var readOnlyCollection = (await scheduler
                .GetTriggersOfJob(new JobKey(jobName, @group)).ConfigureAwait(false));
            var result = new List<TriggerData>();
            foreach (var trigger in readOnlyCollection)
            {
                result.Add(await GetTriggerData(scheduler, trigger).ConfigureAwait(false));
            }
            return result;
        }

        private static async Task<TriggerData> GetTriggerData(IScheduler scheduler, ITrigger trigger)
        {
            return new TriggerData(trigger.Key.Name, await GetTriggerStatus(trigger, scheduler).ConfigureAwait(false))
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