namespace CrystalQuartz.Core.Quartz2.Tests.Stubs
{
    using System;
    using System.Threading;
    using Quartz;

    public class JobExecutionContextStub : IJobExecutionContext
    {
        public void Put(object key, object objectValue)
        {
            throw new NotImplementedException();
        }

        public object Get(object key)
        {
            throw new NotImplementedException();
        }

        public IScheduler Scheduler { get; set; }

        public ITrigger Trigger { get; set; }

        public ICalendar Calendar { get; set; }

        public bool Recovering { get; set; }

        public TriggerKey RecoveringTriggerKey { get; set; }

        public int RefireCount { get; set; }

        public JobDataMap MergedJobDataMap { get; set; }

        public IJobDetail JobDetail { get; set; }

        public IJob JobInstance { get; set; }

        public DateTimeOffset? FireTimeUtc { get; set; }

        public DateTimeOffset? ScheduledFireTimeUtc { get; set; }

        public DateTimeOffset? PreviousFireTimeUtc { get; set; }

        public DateTimeOffset? NextFireTimeUtc { get; set; }

        public string FireInstanceId { get; set; }

        public object Result { get; set; }

        public TimeSpan JobRunTime { get; set; }

        public CancellationToken CancellationToken { get; set; }
    }
}