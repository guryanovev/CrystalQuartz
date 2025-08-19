namespace CrystalQuartz.Core.Contracts
{
    using System;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using CrystalQuartz.Core.Domain.TriggerTypes;

    public class ReadOnlySchedulerCommander : ISchedulerCommander
    {
        public Task ScheduleJob(
            string jobName,
            string jobGroup,
            string? triggerName,
            TriggerType trigger,
            IDictionary<string, object>? jobData) => Fail();

        public Task ScheduleJob(
            string? jobName,
            string? jobGroup,
            Type jobType,
            string? triggerName,
            TriggerType triggerType,
            IDictionary<string, object>? jobData) => Fail();

        public Task DeleteJobGroup(string jobGroup) => Fail();

        public Task DeleteJob(string jobName, string jobGroup) => Fail();

        public Task DeleteTrigger(string triggerName, string triggerGroup) => Fail();

        public Task ExecuteNow(string jobName, string jobGroup) => Fail();

        public Task PauseAllJobs() => Fail();

        public Task PauseJobGroup(string jobGroup) => Fail();

        public Task PauseJob(string jobName, string jobGroup) => Fail();

        public Task PauseTrigger(string triggerName, string triggerGroup) => Fail();

        public Task ResumeAllJobs() => Fail();

        public Task ResumeJobGroup(string jobGroup) => Fail();

        public Task ResumeJob(string jobName, string jobGroup) => Fail();

        public Task ResumeTrigger(string triggerName, string triggerGroup) => Fail();

        public Task StandbyScheduler() => Fail();

        public Task StartScheduler() => Fail();

        public Task StopScheduler() => Fail();

        private Task Fail()
        {
            throw new Exception("Could not perform this action, the scheduler is read-only.");
        }
    }
}