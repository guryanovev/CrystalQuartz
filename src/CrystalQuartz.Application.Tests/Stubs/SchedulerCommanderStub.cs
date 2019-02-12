namespace CrystalQuartz.Application.Tests.Stubs
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using CrystalQuartz.Core.Contracts;
    using CrystalQuartz.Core.Domain.TriggerTypes;
    using NUnit.Framework;

    public class GroupStub
    {
        public GroupStub(string name, params JobStub[] jobs)
        {
            Name = name;
            Jobs = new List<JobStub>(jobs);
        }

        public string Name { get; }

        public IList<JobStub> Jobs { get; }

        public JobStub FindRequiredJob(string name)
        {
            var result = Jobs.FirstOrDefault(x => x.Name == name);

            if (result == null)
            {
                throw new Exception("Job not found: " + name);
            }

            return result;
        }

        public JobStub FindOrCreateJob(string name, Type jobType)
        {
            var result = Jobs.FirstOrDefault(x => x.Name == name);

            if (result == null)
            {
                result = new JobStub(name, jobType);
                Jobs.Add(result);
            }

            return result;
        }

        public JobStub GetSingleJob()
        {
            if (Jobs.Count != 1)
            {
                Assert.Fail("Expected one single job but was: " + Jobs.Count);
            }

            return Jobs.First();
        }
    }

    public class JobStub
    {
        public JobStub(string name, Type jobType, params TriggerStub[] triggers)
        {
            Name = name;
            JobType = jobType;
            Triggers = new List<TriggerStub>(triggers);
        }

        public string Name { get; }
        public Type JobType { get; }

        public IList<TriggerStub> Triggers { get;  }


        public TriggerStub GetSingleTrigger()
        {
            if (Triggers.Count != 1)
            {
                Assert.Fail("Expected one single trigger but was: " + Triggers.Count);
            }

            return Triggers.First();
        }
    }

    public class TriggerStub
    {
        public TriggerStub(string name, TriggerType trigger, IDictionary<string, object> triggerJobData)
        {
            Name = name;
            Trigger = trigger;
            TriggerJobData = triggerJobData;
        }

        public string Name { get; }

        public TriggerType Trigger { get; }

        public IDictionary<string, object> TriggerJobData { get; }
    }

    public class SchedulerCommanderStub : ISchedulerCommander
    {
        public IList<GroupStub> Groups { get; }

        public SchedulerCommanderStub(IList<GroupStub> groups)
        {
            Groups = groups;
        }

        public void ScheduleJob(
            string jobName, 
            string jobGroup, 
            string triggerName, 
            TriggerType trigger, 
            IDictionary<string, object> jobData)
        {
            ScheduleJob(jobName, jobGroup, null, triggerName, trigger, jobData);

//            var group = FindRequiredGroup(jobGroup);
//            var job = group.FindRequiredJob(jobName);
//
//            job.Triggers.Add(new TriggerStub(triggerName ?? Guid.NewGuid().ToString(), trigger, jobData));
        }

        public void ScheduleJob(
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
        }

        public void DeleteJobGroup(string jobGroup)
        {
            throw new NotImplementedException();
        }

        public void DeleteJob(string jobName, string jobGroup)
        {
            throw new NotImplementedException();
        }

        public void DeleteTrigger(string triggerName, string triggerGroup)
        {
            throw new NotImplementedException();
        }

        public void ExecuteNow(string jobName, string jobGroup)
        {
            throw new NotImplementedException();
        }

        public void PauseAllJobs()
        {
            throw new NotImplementedException();
        }

        public void PauseJobGroup(string jobGroup)
        {
            throw new NotImplementedException();
        }

        public void PauseJob(string jobName, string jobGroup)
        {
            throw new NotImplementedException();
        }

        public void PauseTrigger(string triggerName, string triggerGroup)
        {
            throw new NotImplementedException();
        }

        public void ResumeAllJobs()
        {
            throw new NotImplementedException();
        }

        public void ResumeJobGroup(string jobGroup)
        {
            throw new NotImplementedException();
        }

        public void ResumeJob(string jobName, string jobGroup)
        {
            throw new NotImplementedException();
        }

        public void ResumeTrigger(string triggerName, string triggerGroup)
        {
            throw new NotImplementedException();
        }

        public void StandbyScheduler()
        {
            throw new NotImplementedException();
        }

        public void StartScheduler()
        {
            throw new NotImplementedException();
        }

        public void StopScheduler()
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