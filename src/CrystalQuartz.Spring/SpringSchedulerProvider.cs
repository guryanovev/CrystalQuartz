namespace CrystalQuartz.Spring
{
    using Core.SchedulerProviders;
    using global::Spring.Context.Support;
    using Quartz;

    public class SpringSchedulerProvider : ISchedulerProvider
    {
        public void Init()
        {
        }

        public IScheduler Scheduler
        {
            get
            {
                var applicationContext = ContextRegistry.GetContext();
                return (IScheduler) applicationContext.GetObject(SchedulerName);
            }
        }

        public string SchedulerName { get; set; }
    }
}