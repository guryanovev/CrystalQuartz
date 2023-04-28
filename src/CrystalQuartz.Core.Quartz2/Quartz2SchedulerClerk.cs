namespace CrystalQuartz.Core.Quartz2
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using CrystalQuartz.Core.Contracts;
    using CrystalQuartz.Core.Domain;
    using CrystalQuartz.Core.Domain.Activities;
    using CrystalQuartz.Core.Utils;
    using Quartz;
    using Quartz.Impl.Matchers;

    internal class Quartz2SchedulerClerk : ISchedulerClerk
    {
        private static readonly TriggerTypeExtractor TriggerTypeExtractor = new TriggerTypeExtractor();

        private readonly IScheduler _scheduler;

        public Quartz2SchedulerClerk(IScheduler scheduler)
        {
            _scheduler = scheduler;
        }

        public Task<SchedulerData> GetSchedulerData()
        {
            IScheduler scheduler = _scheduler;
            SchedulerMetaData metadata = scheduler.GetMetaData();

            IList<ExecutingJobInfo> inProgressJobs = metadata.SchedulerRemote ? (IList<ExecutingJobInfo>) new ExecutingJobInfo[0] :
                scheduler
                    .GetCurrentlyExecutingJobs()
                    .Select(x => new ExecutingJobInfo
                    {
                        UniqueTriggerKey = x.Trigger.Key.ToString(),
                        FireInstanceId = x.FireInstanceId
                    })
                    .ToList();
            SchedulerData schedulerData = new SchedulerData
            {
                Name = scheduler.SchedulerName,
                InstanceId = scheduler.SchedulerInstanceId,
                JobGroups = GetJobGroups(scheduler),
                Status = GetSchedulerStatus(scheduler),
                JobsExecuted = metadata.NumberOfJobsExecuted,
                JobsTotal = scheduler.IsShutdown ? 0 : scheduler.GetJobKeys(GroupMatcher<JobKey>.AnyGroup()).Count,
                RunningSince = metadata.RunningSince.ToDateTime(),
                InProgress = inProgressJobs
            };

            return AsyncUtils.FromResult(schedulerData);
        }

        public Task<JobDetailsData> GetJobDetailsData(string name, string group)
        {
            var scheduler = _scheduler;
            if (scheduler.IsShutdown)
            {
                return null;
            }

            IJobDetail job;

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

                return AsyncUtils.FromResult(new JobDetailsData(null, null));
            }

            if (job == null)
            {
                return null;
            }

            return AsyncUtils.FromResult(new JobDetailsData(
                GetJobDetails(job),
                job.JobDataMap.ToDictionary(x => x.Key, x => x.Value)));
        }

        private JobDetails GetJobDetails(IJobDetail job)
        {
            return new JobDetails
            {
                ConcurrentExecutionDisallowed = job.ConcurrentExecutionDisallowed,
                Description = job.Description,
                Durable = job.Durable,
                JobType = job.JobType,
                PersistJobDataAfterExecution = job.PersistJobDataAfterExecution,
                RequestsRecovery = job.RequestsRecovery
            };
        }

        public Task<SchedulerDetails> GetSchedulerDetails()
        {
            IScheduler scheduler = _scheduler;
            SchedulerMetaData metadata = scheduler.GetMetaData();

            return AsyncUtils.FromResult(new SchedulerDetails
            {
                InStandbyMode = metadata.InStandbyMode,
                JobStoreClustered = metadata.JobStoreClustered,
                JobStoreSupportsPersistence = metadata.JobStoreSupportsPersistence,
                JobStoreType = metadata.JobStoreType,
                NumberOfJobsExecuted = metadata.NumberOfJobsExecuted,
                RunningSince = metadata.RunningSince.ToUnixTicks(),
                SchedulerInstanceId = metadata.SchedulerInstanceId,
                SchedulerName = metadata.SchedulerName,
                SchedulerRemote = metadata.SchedulerRemote,
                SchedulerType = metadata.SchedulerType,
                Shutdown = metadata.Shutdown,
                Started = metadata.Started,
                ThreadPoolSize = metadata.ThreadPoolSize,
                ThreadPoolType = metadata.ThreadPoolType,
                Version = metadata.Version
            });
        }

        public Task<TriggerDetailsData> GetTriggerDetailsData(string name, string group)
        {
            var scheduler = _scheduler;
            if (scheduler.IsShutdown)
            {
                return null;
            }

            ITrigger trigger = scheduler.GetTrigger(new TriggerKey(name, group));
            if (trigger == null)
            {
                return null;
            }

            return AsyncUtils.FromResult(new TriggerDetailsData
            {
                PrimaryTriggerData = GetTriggerData(scheduler, trigger),
                SecondaryTriggerData = GetTriggerSecondaryData(trigger),
                JobDataMap = trigger.JobDataMap.ToDictionary(x => x.Key, x => x.Value)
            });
        }

        public Task<IEnumerable<Type>> GetScheduledJobTypes()
        {
            var scheduler = _scheduler;

            IEnumerable<Type> result = scheduler.IsShutdown
                ? Type.EmptyTypes
                : scheduler
                    .GetJobKeys(GroupMatcher<JobKey>.AnyGroup())
                    .Select(key => scheduler.GetJobDetail(key).JobType);
            
            return AsyncUtils.FromResult(result);
        }

        private static TriggerSecondaryData GetTriggerSecondaryData(ITrigger trigger)
        {
            return new TriggerSecondaryData
            {
                Description = trigger.Description,
                Priority = trigger.Priority,
                MisfireInstruction = trigger.MisfireInstruction,
                    
            };
        }

        private SchedulerStatus GetSchedulerStatus(IScheduler scheduler)
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

            if (scheduler.InStandbyMode)
            {
                return SchedulerStatus.Ready;
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
            return new JobData(jobName, group, GetTriggers(scheduler, jobName, group));
        }

        private static IList<TriggerData> GetTriggers(IScheduler scheduler, string jobName, string group)
        {
            return scheduler
                .GetTriggersOfJob(new JobKey(jobName, group))
                .Select(trigger => GetTriggerData(scheduler, trigger))
                .ToList();
        }

        private static TriggerData GetTriggerData(IScheduler scheduler, ITrigger trigger)
        {
            return new TriggerData(
                trigger.Key.ToString(),
                trigger.Key.Group,
                trigger.Key.Name, 
                GetTriggerStatus(trigger, scheduler),
                trigger.StartTimeUtc.ToUnixTicks(),
                trigger.EndTimeUtc.ToUnixTicks(),
                trigger.GetNextFireTimeUtc().ToUnixTicks(),
                trigger.GetPreviousFireTimeUtc().ToUnixTicks(),
                TriggerTypeExtractor.GetFor(trigger));
        }
    }
}