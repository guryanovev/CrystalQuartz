namespace CrystalQuartz.Application.Commands
{
    using System.Threading.Tasks;
    using CrystalQuartz.Core.Domain.Events;
    using Inputs;

    public class PauseJobCommand : AbstractOperationCommand<JobInput>
    {
        public PauseJobCommand(ISchedulerHostProvider schedulerHostProvider) : base(schedulerHostProvider)
        {
        }

        protected override async Task PerformOperation(JobInput input)
        {
            await SchedulerHost.Commander.PauseJob(input.Job, input.Group);
            
            RiseEvent(new RawSchedulerEvent(SchedulerEventScope.Job, SchedulerEventType.Paused, string.Format("{0}.{1}", input.Group, input.Job), null)); 
        }
    }
}