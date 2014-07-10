using CrystalQuartz.Core.SchedulerProviders;
using CrystalQuartz.Web.Comands.Inputs;
using CrystalQuartz.WebFramework.Commands;
using Quartz;

namespace CrystalQuartz.Web.Comands
{
    public class PauseTriggerCommand : AbstractSchedulerCommand<TriggerInput, CommandResult>
    {
        public PauseTriggerCommand(ISchedulerProvider schedulerProvider) : base(schedulerProvider)
        {
        }

        protected override void InternalExecute(TriggerInput input, CommandResult output)
        {
            Scheduler.PauseTrigger(new TriggerKey(input.Trigger, input.Group));
        }
    }
}