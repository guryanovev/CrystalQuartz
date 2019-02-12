namespace CrystalQuartz.Application.Tests.Stubs
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using CrystalQuartz.Core.Contracts;
    using NUnit.Framework;

    public class SchedulerHostStub
    {
        public SchedulerCommanderStub SchedulerCommander { get; }

        public SchedulerHost Value { get; }

        public SchedulerHostStub(params GroupStub[] groups)
        {
            SchedulerCommander = new SchedulerCommanderStub(new List<GroupStub>(groups));
            Value = new SchedulerHost(null, SchedulerCommander, new Version(1, 0, 0, 0), null, null);
        }

        public GroupStub GetSingleGroup()
        {
            var groups = SchedulerCommander.Groups;

            if (groups.Count != 1)
            {
                Assert.Fail("Expected one single group but was: " + groups.Count);
            }

            return groups.First();
        }

        public void AssertEmpty()
        {
            var groups = SchedulerCommander.Groups;

            if (groups.Count > 0)
            {
                Assert.Fail("Expected empty groups list but {0} groups found.", groups.Count);
            }
        }
    }
}