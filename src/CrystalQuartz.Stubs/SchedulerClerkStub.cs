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

        public JobDetailsData GetJobDetailsData(string name, string @group)
        {
            throw new NotImplementedException();
        }

        public SchedulerDetails GetSchedulerDetails()
        {
            throw new NotImplementedException();
        }

        public TriggerDetailsData GetTriggerDetailsData(string name, string @group)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Type> GetScheduledJobTypes()
        {
            return Groups
                .SelectMany(g => g.Jobs)
                .Select(j => j.JobType)
                .Where(x => x != null)
                .Distinct();
        }
    }
}