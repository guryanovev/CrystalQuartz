using CrystalQuartz.Core;
using CrystalQuartz.Core.SchedulerProviders;
using CrystalQuartz.Web.Comands.Inputs;
using CrystalQuartz.Web.Comands.Outputs;
using CrystalQuartz.Web.Helpers;

namespace CrystalQuartz.Web.Comands
{
    public class StartSchedulerCommand : AbstractSchedulerCommand<NoInput, SchedulerDataOutput>
    {
        public StartSchedulerCommand(ISchedulerProvider schedulerProvider, ISchedulerDataProvider schedulerDataProvider) : base(schedulerProvider, schedulerDataProvider)
        {
        }

        protected override void InternalExecute(NoInput input, SchedulerDataOutput output)
        {
            Scheduler.Start();
            SchedulerDataProvider.Data.MapToOutput(output);
        }
    }
}