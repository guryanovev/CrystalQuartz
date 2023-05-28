namespace CrystalQuartz.Core.Domain.Activities
{
    using System;
    using System.Collections.Generic;
    using System.Linq;

    public abstract class ActivityNode<T> : Activity
        where T : Activity
    {
        private static readonly int MaxActivityStatus = Enum.GetValues(typeof(ActivityStatus)).Cast<int>().Max();

        protected ActivityNode(string name, IEnumerable<T>? children)
            : base(name, GetActivityStatus(children))
        {
        }

        protected ActivityNode(string name)
            : base(name)
        {
        }

        private static ActivityStatus GetActivityStatus(IEnumerable<T>? children)
        {
            // Fast single loop implementation of status analyzing.
            // Using this instead on linq operations for performance reasons
            // as such methods call very often.
            int[] counters = new int[MaxActivityStatus + 1];
            int totalCount = 0;
            if (children != null)
            {
                foreach (T child in children)
                {
                    totalCount++;
                    counters[(int)child.Status]++;
                }
            }

            if (totalCount == 0)
            {
                return ActivityStatus.Complete;
            }

            if (counters[(int)ActivityStatus.Complete] == totalCount)
            {
                return ActivityStatus.Complete;
            }

            if (counters[(int)ActivityStatus.Complete] + counters[(int)ActivityStatus.Active] == totalCount)
            {
                return ActivityStatus.Active;
            }

            if (counters[(int)ActivityStatus.Complete] + counters[(int)ActivityStatus.Paused] == totalCount)
            {
                return ActivityStatus.Paused;
            }

            return ActivityStatus.Mixed;
        }
    }
}