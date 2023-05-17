namespace CrystalQuartz.Core.Contracts
{
    public class SchedulerServices
    {
        public SchedulerServices(
            ISchedulerClerk clerk,
            ISchedulerCommander commander,
            ISchedulerEventSource eventSource)
        {
            Clerk = clerk;
            Commander = commander;
            EventSource = eventSource;
        }

        public ISchedulerClerk Clerk { get; }

        public ISchedulerCommander Commander { get; }

        public ISchedulerEventSource EventSource { get; }
    }
}