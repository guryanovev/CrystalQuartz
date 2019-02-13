namespace CrystalQuartz.Core.Quartz3
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
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

        public void ScheduleJob(
            string jobName, 
            string jobGroup, 
            string triggerName, 
            TriggerType trigger, 
            IDictionary<string, object> jobData)
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
        }

        public void ScheduleJob(
            string jobName, 
            string jobGroup, 
            Type jobType, 
            string triggerName,
            TriggerType triggerType, 
            IDictionary<string, object> jobData)
        {
            var jobBuilder = JobBuilder
                .Create(jobType)
                .WithIdentity(jobName, jobGroup);

            if (jobData != null)
            {
                jobBuilder = jobBuilder.UsingJobData(new JobDataMap(jobData));
            }

            TriggerBuilder triggerBuilder = ApplyTriggerData(triggerName, triggerType, TriggerBuilder.Create());

            _scheduler.ScheduleJob(jobBuilder.Build(), triggerBuilder.Build());
        }

        public void DeleteJobGroup(string jobGroup)
        {
            var keys = _scheduler.GetJobKeys(GroupMatcher<JobKey>.GroupEquals(jobGroup)).Result;
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