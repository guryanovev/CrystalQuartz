﻿namespace CrystalQuartz.Stubs
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using Application;
    using CrystalQuartz.Core.Contracts;
    using NUnit.Framework;

    public class SchedulerHostStub : ISchedulerHostProvider
    {
        public IList<GroupStub> Groups { get; }

        public SchedulerCommanderStub SchedulerCommander { get; }

        public SchedulerClerkStub SchedulerClerk { get; }

        public SchedulerHost SchedulerHost => Value;

        public SchedulerHost Value { get; }

        public SchedulerHostStub(params GroupStub[] groups) : this(new Type[] { }, groups)
        {
        }

        public SchedulerHostStub(Type[] allowedJobTypes, params GroupStub[] groups)
        {
            Groups = new List<GroupStub>(groups);

            SchedulerCommander = new SchedulerCommanderStub(Groups);
            SchedulerClerk = new SchedulerClerkStub(Groups);

            Value = new ReadySchedulerHost(
                SchedulerClerk, 
                SchedulerCommander, 
                new Version(1, 0, 0, 0), 
                null!, 
                null!,
                new AllowedJobTypesRegistryStub(allowedJobTypes));
        }

        public GroupStub GetSingleGroup()
        {
            var groups = Groups;

            if (groups.Count != 1)
            {
                Assert.Fail("Expected one single group but was: " + groups.Count);
            }

            return groups.First();
        }

        public void AssertEmpty()
        {
            var groups = Groups;

            if (groups.Count > 0)
            {
                Assert.Fail("Expected empty groups list but {0} groups found.", groups.Count);
            }
        }
    }
}