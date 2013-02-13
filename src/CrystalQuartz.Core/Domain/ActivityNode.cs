namespace CrystalQuartz.Core.Domain
{
    using System.Collections.Generic;
    using System.Linq;

    public abstract class ActivityNode<T> : Activity where T : Activity
    {
        protected ActivityNode(string name, ActivityStatus status) : base(name, status)
        {
        }

        protected ActivityNode(string name) : base(name)
        {
        }

        public override void Init()
        {
            base.Init(); 

            if (ChildrenActivities == null || ChildrenActivities.Count == 0)
            {
                Status = ActivityStatus.Complete;
            }
            else if (ChildrenActivities.All(a => a.Status == ActivityStatus.Complete))
            {
                Status = ActivityStatus.Complete;
            }
            else if (ChildrenActivities.All(a => a.Status == ActivityStatus.Active || a.Status == ActivityStatus.Complete))
            {
                Status = ActivityStatus.Active;
            }
            else if (ChildrenActivities.All(a => a.Status == ActivityStatus.Paused || a.Status == ActivityStatus.Complete))
            {
                Status = ActivityStatus.Paused;
            }
            else
            {
                Status = ActivityStatus.Mixed;
            }
        }

        protected abstract IList<T> ChildrenActivities { get; }
    }
}