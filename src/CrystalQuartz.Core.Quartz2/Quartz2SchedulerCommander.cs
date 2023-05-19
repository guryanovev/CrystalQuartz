namespace CrystalQuartz.Core.Quartz2
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using CrystalQuartz.Core.Contracts;
    using CrystalQuartz.Core.Domain.TriggerTypes;
    using Quartz;
    using Quartz.Impl.Matchers;

    internal class Quartz2SchedulerCommander : ISchedulerCommander
    {
        private readonly IScheduler _scheduler;

        public Quartz2SchedulerCommander(IScheduler scheduler)
        {
            _scheduler = scheduler;
        }

        public Task ScheduleJob(
            string jobName,
            string jobGroup,
            string triggerName,
            TriggerType trigger,
            IDictionary<string, object>? jobData)
        {
            TriggerBuilder triggerBuilder = ApplyTriggerData(
                triggerName,
                trigger,
                TriggerBuilder
                    .Create()
                    .ForJob(jobName, jobGroup));

            if (jobData != null)
            {
                triggerBuilder = triggerBuilder.UsingJobData(new JobDataMap(jobData));
            }

            _scheduler.ScheduleJob(triggerBuilder.Build());

            return AsyncUtils.CompletedTask();
        }

        public Task ScheduleJob(
            string jobName,
            string jobGroup,
            Type jobType,
            string triggerName,
            TriggerType triggerType,
            IDictionary<string, object>? jobData)
        {
            var jobBuilder = JobBuilder.Create(jobType);

            if (!string.IsNullOrEmpty(jobName) || !string.IsNullOrEmpty(jobGroup))
            {
                jobBuilder = jobBuilder.WithIdentity(jobName ?? Guid.NewGuid().ToString(), jobGroup);
            }

            if (jobData != null)
            {
                jobBuilder = jobBuilder.UsingJobData(new JobDataMap(jobData));
            }

            TriggerBuilder triggerBuilder = ApplyTriggerData(triggerName, triggerType, TriggerBuilder.Create());

            _scheduler.ScheduleJob(jobBuilder.Build(), triggerBuilder.Build());

            return AsyncUtils.CompletedTask();
        }

        public Task DeleteJobGroup(string jobGroup)
        {
            var keys = _scheduler.GetJobKeys(GroupMatcher<JobKey>.GroupEquals(jobGroup));
            _scheduler.DeleteJobs(keys.ToList());

            return AsyncUtils.CompletedTask();
        }

        public Task DeleteJob(string jobName, string jobGroup)
        {
            _scheduler.DeleteJob(new JobKey(jobName, jobGroup));

            return AsyncUtils.CompletedTask();
        }

        public Task DeleteTrigger(string triggerName, string triggerGroup)
        {
            _scheduler.UnscheduleJob(new TriggerKey(triggerName, triggerGroup));

            return AsyncUtils.CompletedTask();
        }

        public Task ExecuteNow(string jobName, string jobGroup)
        {
            _scheduler.TriggerJob(new JobKey(jobName, jobGroup));

            return AsyncUtils.CompletedTask();
        }

        public Task PauseAllJobs()
        {
            _scheduler.PauseAll();

            return AsyncUtils.CompletedTask();
        }

        public Task PauseJobGroup(string jobGroup)
        {
            _scheduler.PauseJobs(GroupMatcher<JobKey>.GroupEquals(jobGroup));

            return AsyncUtils.CompletedTask();
        }

        public Task PauseJob(string jobName, string jobGroup)
        {
            _scheduler.PauseJob(new JobKey(jobName, jobGroup));

            return AsyncUtils.CompletedTask();
        }

        public Task PauseTrigger(string triggerName, string triggerGroup)
        {
            var triggerKey = new TriggerKey(triggerName, triggerGroup);
            _scheduler.PauseTrigger(triggerKey);

            return AsyncUtils.CompletedTask();
        }

        public Task ResumeAllJobs()
        {
            _scheduler.ResumeAll();

            return AsyncUtils.CompletedTask();
        }

        public Task ResumeJobGroup(string jobGroup)
        {
            _scheduler.ResumeJobs(GroupMatcher<JobKey>.GroupEquals(jobGroup));

            return AsyncUtils.CompletedTask();
        }

        public Task ResumeJob(string jobName, string jobGroup)
        {
            _scheduler.ResumeJob(new JobKey(jobName, jobGroup));

            return AsyncUtils.CompletedTask();
        }

        public Task ResumeTrigger(string triggerName, string triggerGroup)
        {
            _scheduler.ResumeTrigger(new TriggerKey(triggerName, triggerGroup));

            return AsyncUtils.CompletedTask();
        }

        public Task StandbyScheduler()
        {
            _scheduler.Standby();

            return AsyncUtils.CompletedTask();
        }

        public Task StartScheduler()
        {
            _scheduler.Start();

            return AsyncUtils.CompletedTask();
        }

        public Task StopScheduler()
        {
            _scheduler.Shutdown(false);

            return AsyncUtils.CompletedTask();
        }

        private static TriggerBuilder ApplyTriggerData(string triggerName, TriggerType trigger, TriggerBuilder triggerBuilder)
        {
            if (!string.IsNullOrEmpty(triggerName))
            {
                triggerBuilder = triggerBuilder.WithIdentity(triggerName);
            }

            if (trigger is SimpleTriggerType simpleTrigger)
            {
                triggerBuilder = triggerBuilder.WithSimpleSchedule(x =>
                {
                    if (simpleTrigger.RepeatCount == -1)
                    {
                        x.RepeatForever();
                    }
                    else
                    {
                        x.WithRepeatCount(simpleTrigger.RepeatCount);
                    }

                    x.WithInterval(TimeSpan.FromMilliseconds(simpleTrigger.RepeatInterval));
                });
            }
            else if (trigger is CronTriggerType cronTriggerType)
            {
                triggerBuilder = triggerBuilder.WithCronSchedule(cronTriggerType.CronExpression);
            }
            else
            {
                throw new Exception("Unsupported trigger type: " + trigger.Code);
            }

            return triggerBuilder;
        }
    }
}