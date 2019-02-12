namespace CrystalQuartz.Application.Tests.Stubs
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
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
}