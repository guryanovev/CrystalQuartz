namespace CrystalQuartz.Stubs
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using CrystalQuartz.Core.Contracts;
    using CrystalQuartz.Core.Domain;

    public class SchedulerClerkStub : ISchedulerClerk
    {
        public SchedulerClerkStub(params GroupStub[] groups) : this(new List<GroupStub>(groups))
        {
        }

        public SchedulerClerkStub(IList<GroupStub> groups)
        {
            Groups = groups;
        }

        public IList<GroupStub> Groups { get; }

        public Task<SchedulerData> GetSchedulerData()
        {
            throw new NotImplementedException();
        }

        public Task<JobDetailsData> GetJobDetailsData(string name, string @group)
        {
            throw new NotImplementedException();
        }

        public Task<SchedulerDetails> GetSchedulerDetails()
        {
            throw new NotImplementedException();
        }

        public Task<TriggerDetailsData> GetTriggerDetailsData(string name, string @group)
        {
            throw new NotImplementedException();
        }

        public Task<IEnumerable<Type>> GetScheduledJobTypes()
        {
            return Task.FromResult(Groups
                .SelectMany(g => g.Jobs)
                .Select(j => j.JobType)
                .Where(x => x != null)
                .Distinct());
        }
    }
}