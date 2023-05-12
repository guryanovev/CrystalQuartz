namespace CrystalQuartz.Application.Commands
{
    using System.Threading.Tasks;
    using CrystalQuartz.Core.Domain.Events;
    using Inputs;

    public class StopSchedulerCommand : AbstractOperationCommand<NoInput>
    {
        public StopSchedulerCommand(ISchedulerHostProvider schedulerHostProvider) : base(schedulerHostProvider)
        {
        }

        protected override async Task PerformOperation(NoInput input)
        {
            await SchedulerHost.Commander.StopScheduler();

            RiseEvent(new RawSchedulerEvent(SchedulerEventScope.Scheduler, SchedulerEventType.Shutdown, null, null));
        }
    }
}