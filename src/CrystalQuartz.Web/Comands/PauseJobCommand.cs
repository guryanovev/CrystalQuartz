using CrystalQuartz.Core.SchedulerProviders;
using CrystalQuartz.Web.Comands.Inputs;
using CrystalQuartz.WebFramework.Commands;
using Quartz;

namespace CrystalQuartz.Web.Comands
{
    public class PauseJobCommand : AbstractSchedulerCommand<JobInput, CommandResult>
    {
        public PauseJobCommand(ISchedulerProvider schedulerProvider) : base(schedulerProvider)
        {
        }

        protected override void InternalExecute(JobInput input, CommandResult output)
        {
            Scheduler.PauseJob(new JobKey(input.Job, input.Group));
        }
    }
}