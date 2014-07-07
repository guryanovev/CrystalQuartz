using CrystalQuartz.Core.SchedulerProviders;
using CrystalQuartz.Web.Comands.Inputs;
using CrystalQuartz.WebFramework.Commands;
using Quartz;
using Quartz.Impl.Matchers;

namespace CrystalQuartz.Web.Comands
{
    public class PauseGroupCommand : AbstractSchedulerCommand<GroupInput>
    {
        public PauseGroupCommand(ISchedulerProvider schedulerProvider) : base(schedulerProvider)
        {
        }

        protected override void InternalExecute(GroupInput input, CommandResult output)
        {
            Scheduler.PauseJobs(GroupMatcher<JobKey>.GroupEquals(input.Group));
        }
    }
}