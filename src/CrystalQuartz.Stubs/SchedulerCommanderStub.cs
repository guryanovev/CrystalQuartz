namespace CrystalQuartz.Stubs
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using CrystalQuartz.Core.Contracts;
    using CrystalQuartz.Core.Domain.TriggerTypes;

    public class SchedulerCommanderStub : ISchedulerCommander
    {
        public IList<GroupStub> Groups { get; }

        public SchedulerCommanderStub(IList<GroupStub> groups)
        {
            Groups = groups;
        }

        public async Task ScheduleJob(
            string jobName, 
            string jobGroup, 
            string triggerName, 
            TriggerType trigger, 
            IDictionary<string, object> jobData)
        {
            await ScheduleJob(jobName, jobGroup, null, triggerName, trigger, jobData);

//            var group = FindRequiredGroup(jobGroup);
//            var job = group.FindRequiredJob(jobName);
//
//            job.Triggers.Add(new TriggerStub(triggerName ?? Guid.NewGuid().ToString(), trigger, jobData));
        }

        public Task ScheduleJob(
            string jobName, 
            string jobGroup, 
            Type jobType, 
            string triggerName, 
            TriggerType triggerType,
            IDictionary<string, object> jobData)
        {
            var group = FindOrCreateGroup(jobGroup ?? "Default");
            var job = group.FindOrCreateJob(jobName ?? Guid.NewGuid().ToString(), jobType);

            job.Triggers.Add(new TriggerStub(triggerName ?? Guid.NewGuid().ToString(), triggerType, jobData));

            return Task.CompletedTask;
        }

        public Task DeleteJobGroup(string jobGroup)
        {
            throw new NotImplementedException();
        }

        public Task DeleteJob(string jobName, string jobGroup)
        {
            throw new NotImplementedException();
        }

        public Task DeleteTrigger(string triggerName, string triggerGroup)
        {
            throw new NotImplementedException();
        }

        public Task ExecuteNow(string jobName, string jobGroup)
        {
            throw new NotImplementedException();
        }

        public Task PauseAllJobs()
        {
            throw new NotImplementedException();
        }

        public Task PauseJobGroup(string jobGroup)
        {
            throw new NotImplementedException();
        }

        public Task PauseJob(string jobName, string jobGroup)
        {
            throw new NotImplementedException();
        }

        public Task PauseTrigger(string triggerName, string triggerGroup)
        {
            throw new NotImplementedException();
        }

        public Task ResumeAllJobs()
        {
            throw new NotImplementedException();
        }

        public Task ResumeJobGroup(string jobGroup)
        {
            throw new NotImplementedException();
        }

        public Task ResumeJob(string jobName, string jobGroup)
        {
            throw new NotImplementedException();
        }

        public Task ResumeTrigger(string triggerName, string triggerGroup)
        {
            throw new NotImplementedException();
        }

        public Task StandbyScheduler()
        {
            throw new NotImplementedException();
        }

        public Task StartScheduler()
        {
            throw new NotImplementedException();
        }

        public Task StopScheduler()
        {
            throw new NotImplementedException();
        }

        public GroupStub FindRequiredGroup(string name)
        {
            var result = Groups.FirstOrDefault(x => x.Name == name);

            if (result == null)
            {
                throw new Exception("Group not found: " + name);
            }

            return result;
        }

        public GroupStub FindOrCreateGroup(string name)
        {
            var result = Groups.FirstOrDefault(x => x.Name == name);

            if (result == null)
            {
                result = new GroupStub(name);
                Groups.Add(result);
            }

            return result;
        }
    }
}