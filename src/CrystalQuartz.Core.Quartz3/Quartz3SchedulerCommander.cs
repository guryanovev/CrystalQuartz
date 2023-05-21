namespace CrystalQuartz.Core.Quartz3
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using CrystalQuartz.Core.Contracts;
    using CrystalQuartz.Core.Domain.TriggerTypes;
    using Quartz;
    using Quartz.Impl.Matchers;

    internal class Quartz3SchedulerCommander : ISchedulerCommander
    {
        private readonly IScheduler _scheduler;

        public Quartz3SchedulerCommander(IScheduler scheduler)
        {
            _scheduler = scheduler;
        }

        public async Task ScheduleJob(
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

            await _scheduler.ScheduleJob(triggerBuilder.Build());
        }

        public async Task ScheduleJob(
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

            await _scheduler.ScheduleJob(jobBuilder.Build(), triggerBuilder.Build());
        }

        public async Task DeleteJobGroup(string jobGroup)
        {
            IReadOnlyCollection<JobKey> keys = await _scheduler.GetJobKeys(GroupMatcher<JobKey>.GroupEquals(jobGroup));

            await _scheduler.DeleteJobs(keys.ToList());
        }

        public async Task DeleteJob(string jobName, string jobGroup)
        {
            await _scheduler.DeleteJob(new JobKey(jobName, jobGroup));
        }

        public async Task DeleteTrigger(string triggerName, string triggerGroup)
        {
            await _scheduler.UnscheduleJob(new TriggerKey(triggerName, triggerGroup));
        }

        public async Task ExecuteNow(string jobName, string jobGroup)
        {
            await _scheduler.TriggerJob(new JobKey(jobName, jobGroup));
        }

        public async Task PauseAllJobs()
        {
            await _scheduler.PauseAll();
        }

        public async Task PauseJobGroup(string jobGroup)
        {
            await _scheduler.PauseJobs(GroupMatcher<JobKey>.GroupEquals(jobGroup));
        }

        public async Task PauseJob(string jobName, string jobGroup)
        {
            await _scheduler.PauseJob(new JobKey(jobName, jobGroup));
        }

        public async Task PauseTrigger(string triggerName, string triggerGroup)
        {
            var triggerKey = new TriggerKey(triggerName, triggerGroup);

            await _scheduler.PauseTrigger(triggerKey);
        }

        public async Task ResumeAllJobs()
        {
            await _scheduler.ResumeAll();
        }

        public async Task ResumeJobGroup(string jobGroup)
        {
            await _scheduler.ResumeJobs(GroupMatcher<JobKey>.GroupEquals(jobGroup));
        }

        public async Task ResumeJob(string jobName, string jobGroup)
        {
            await _scheduler.ResumeJob(new JobKey(jobName, jobGroup));
        }

        public async Task ResumeTrigger(string triggerName, string triggerGroup)
        {
            await _scheduler.ResumeTrigger(new TriggerKey(triggerName, triggerGroup));
        }

        public async Task StandbyScheduler()
        {
            await _scheduler.Standby();
        }

        public async Task StartScheduler()
        {
            await _scheduler.Start();
        }

        public async Task StopScheduler()
        {
            await _scheduler.Shutdown(false);
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