namespace CrystalQuartz.Core.Quartz2
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
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

        public void TriggerJob(
            string jobName, 
            string jobGroup, 
            string triggerName, 
            TriggerType trigger,
            IDictionary<string, object> jobData)
        {
            TriggerBuilder triggerBuilder = TriggerBuilder
                .Create()
                .ForJob(jobName, jobGroup);

            if (!string.IsNullOrEmpty(triggerName))
            {
                triggerBuilder = triggerBuilder.WithIdentity(triggerName);
            }

            SimpleTriggerType simpleTrigger = trigger as SimpleTriggerType;
            if (simpleTrigger != null)
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
            else
            {
                CronTriggerType cronTriggerType = trigger as CronTriggerType;
                if (cronTriggerType != null)
                {
                    triggerBuilder = triggerBuilder.WithCronSchedule(cronTriggerType.CronExpression);
                }
            }

            if (jobData != null)
            {
                triggerBuilder = triggerBuilder.UsingJobData(new JobDataMap(jobData));
            }

            _scheduler.ScheduleJob(triggerBuilder.Build());
        }

        public void DeleteJobGroup(string jobGroup)
        {
            var keys = _scheduler.GetJobKeys(GroupMatcher<JobKey>.GroupEquals(jobGroup));
            _scheduler.DeleteJobs(keys.ToList());
        }

        public void DeleteJob(string jobName, string jobGroup)
        {
            _scheduler.DeleteJob(new JobKey(jobName, jobGroup));
        }

        public void DeleteTrigger(string triggerName, string triggerGroup)
        {
            _scheduler.UnscheduleJob(new TriggerKey(triggerName, triggerGroup));
        }

        public void ExecuteNow(string jobName, string jobGroup)
        {
            _scheduler.TriggerJob(new JobKey(jobName, jobGroup));
        }

        public void PauseAllJobs()
        {
            _scheduler.PauseAll();
        }

        public void PauseJobGroup(string jobGroup)
        {
            _scheduler.PauseJobs(GroupMatcher<JobKey>.GroupEquals(jobGroup));
        }

        public void PauseJob(string jobName, string jobGroup)
        {
            _scheduler.PauseJob(new JobKey(jobName, jobGroup));
        }

        public void PauseTrigger(string triggerName, string triggerGroup)
        {
            var triggerKey = new TriggerKey(triggerName, triggerGroup);
            _scheduler.PauseTrigger(triggerKey);
        }

        public void ResumeAllJobs()
        {
            _scheduler.ResumeAll();
        }

        public void ResumeJobGroup(string jobGroup)
        {
            _scheduler.ResumeJobs(GroupMatcher<JobKey>.GroupEquals(jobGroup));
        }

        public void ResumeJob(string jobName, string jobGroup)
        {
            _scheduler.ResumeJob(new JobKey(jobName, jobGroup));
        }

        public void ResumeTrigger(string triggerName, string triggerGroup)
        {
            _scheduler.ResumeTrigger(new TriggerKey(triggerName, triggerGroup));
        }

        public void StandbyScheduler()
        {
            _scheduler.Standby();
        }

        public void StartScheduler()
        {
            _scheduler.Start();
        }

        public void StopScheduler()
        {
            _scheduler.Shutdown(false);
        }
    }
}