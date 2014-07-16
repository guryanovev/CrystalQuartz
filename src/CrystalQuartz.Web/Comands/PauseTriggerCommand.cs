using CrystalQuartz.Core;
using CrystalQuartz.Core.SchedulerProviders;
using CrystalQuartz.Web.Comands.Inputs;
using CrystalQuartz.Web.Comands.Outputs;
using CrystalQuartz.Web.Helpers;
using Quartz;

namespace CrystalQuartz.Web.Comands
{
    public class PauseTriggerCommand : AbstractSchedulerCommand<TriggerInput, SchedulerDataOutput>
    {
        public PauseTriggerCommand(ISchedulerProvider schedulerProvider, ISchedulerDataProvider schedulerDataProvider) : base(schedulerProvider, schedulerDataProvider)
        {
        }

        protected override void InternalExecute(TriggerInput input, SchedulerDataOutput output)
        {
            var triggerKey = new TriggerKey(input.Trigger, input.Group);
            Scheduler.PauseTrigger(triggerKey);

            SchedulerDataProvider.Data.MapToOutput(output);
        }
    }
}