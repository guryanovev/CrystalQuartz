using CrystalQuartz.Core;
using CrystalQuartz.Core.SchedulerProviders;
using CrystalQuartz.Web.Comands.Inputs;
using CrystalQuartz.WebFramework.Commands;
using Quartz;

namespace CrystalQuartz.Web.Comands
{
    public class PauseJobCommand : AbstractSchedulerCommand<JobInput, CommandResult>
    {
        public PauseJobCommand(ISchedulerProvider schedulerProvider, ISchedulerDataProvider schedulerDataProvider) : base(schedulerProvider, schedulerDataProvider)
        {
        }

        protected override void InternalExecute(JobInput input, CommandResult output)
        {
            Scheduler.PauseJob(new JobKey(input.Job, input.Group));
        }
    }
}