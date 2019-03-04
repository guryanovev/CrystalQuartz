namespace CrystalQuartz.Stubs
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using NUnit.Framework;

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
}