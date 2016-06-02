namespace CrystalQuartz.Core.Tests.Domain
{
    using System.Collections.Generic;
    using Core.Domain;
    using NUnit.Framework;

    [TestFixture]
    public class ActivityNodeTests
    {
        internal class FakeActivityNode : ActivityNode<Activity>
        {
            private readonly IList<Activity> _children;

            public FakeActivityNode(string name, IList<Activity> children)
                : base(name)
            {
                _children = children;
            }

            protected override IList<Activity> ChildrenActivities
            {
                get { return _children; }
            }
        }

        [Test]
        public void Init_NoChildren_ShouldSetStatusToComplete()
        {
            Assert.That(GetActivityStatus(null), Is.EqualTo(ActivityStatus.Complete));
            Assert.That(GetActivityStatus(new List<Activity>()), Is.EqualTo(ActivityStatus.Complete));
        }

        [Test]
        public void Init_AllChildrenComplete_ShouldSetStatusToComplete()
        {
            Assert.That(GetActivityStatus(new List<Activity>
                                              {
                                                  new Activity("ch1", ActivityStatus.Complete),
                                                  new Activity("ch2", ActivityStatus.Complete),
                                                  new Activity("ch3", ActivityStatus.Complete)
                                              }), Is.EqualTo(ActivityStatus.Complete));
        }

        [Test]
        public void Init_AllChildrenActive_ShouldSetStatusToActive()
        {
            Assert.That(GetActivityStatus(new List<Activity>
                                              {
                                                  new Activity("ch1", ActivityStatus.Active),
                                                  new Activity("ch2", ActivityStatus.Active)
                                              }), Is.EqualTo(ActivityStatus.Active));
        }

        [Test]
        public void Init_AllChildrenPaused_ShouldSetStatusToPaused()
        {
            Assert.That(GetActivityStatus(new List<Activity>
                                              {
                                                  new Activity("ch1", ActivityStatus.Paused),
                                                  new Activity("ch2", ActivityStatus.Paused),
                                                  new Activity("ch3", ActivityStatus.Paused)
                                              }), Is.EqualTo(ActivityStatus.Paused));
        }

        [Test]
        public void Init_SomeChildrenHaveSameStatusAndSomeChildrenComplete_ShouldIgnoreCompleteActivitiesAndSetStatus()
        {
            Assert.That(GetActivityStatus(new List<Activity>
                                              {
                                                  new Activity("ch1", ActivityStatus.Paused),
                                                  new Activity("ch2", ActivityStatus.Paused),
                                                  new Activity("ch3", ActivityStatus.Paused),
                                                  new Activity("ch3", ActivityStatus.Complete),
                                                  new Activity("ch3", ActivityStatus.Complete)
                                              }), Is.EqualTo(ActivityStatus.Paused));
            Assert.That(GetActivityStatus(new List<Activity>
                                              {
                                                  new Activity("ch1", ActivityStatus.Active),
                                                  new Activity("ch2", ActivityStatus.Active),
                                                  new Activity("ch3", ActivityStatus.Active),
                                                  new Activity("ch3", ActivityStatus.Complete),
                                                  new Activity("ch3", ActivityStatus.Complete)
                                              }), Is.EqualTo(ActivityStatus.Active));
        }

        [Test]
        public void Init_AllChildrenHaveDifferentStatus_ShouldSetStatusToMixed()
        {
            Assert.That(GetActivityStatus(new List<Activity>
                                              {
                                                  new Activity("ch1", ActivityStatus.Complete),
                                                  new Activity("ch2", ActivityStatus.Paused),
                                                  new Activity("ch3", ActivityStatus.Active)
                                              }), Is.EqualTo(ActivityStatus.Mixed));
        }

        private static ActivityStatus GetActivityStatus(IList<Activity> children)
        {
            var activityNode = new FakeActivityNode("node", children);
            activityNode.Init();
            return activityNode.Status;
        }
    }
}