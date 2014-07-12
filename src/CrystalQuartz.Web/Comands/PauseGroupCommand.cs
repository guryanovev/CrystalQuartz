using CrystalQuartz.Core;
using CrystalQuartz.Core.SchedulerProviders;
using CrystalQuartz.Web.Comands.Inputs;
using CrystalQuartz.WebFramework.Commands;
using Quartz;
using Quartz.Impl.Matchers;

namespace CrystalQuartz.Web.Comands
{
    public class PauseGroupCommand : AbstractSchedulerCommand<GroupInput, CommandResult>
    {
        public PauseGroupCommand(ISchedulerProvider schedulerProvider, ISchedulerDataProvider schedulerDataProvider) : base(schedulerProvider, schedulerDataProvider)
        {
        }

        protected override void InternalExecute(GroupInput input, CommandResult output)
        {
            Scheduler.PauseJobs(GroupMatcher<JobKey>.GroupEquals(input.Group));
        }
    }
}