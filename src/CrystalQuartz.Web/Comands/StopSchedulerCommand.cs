using CrystalQuartz.Core;
using CrystalQuartz.Core.SchedulerProviders;
using CrystalQuartz.Web.Comands.Inputs;
using CrystalQuartz.Web.Comands.Outputs;
using CrystalQuartz.Web.Helpers;

namespace CrystalQuartz.Web.Comands
{
    public class StopSchedulerCommand : AbstractSchedulerCommand<NoInput, SchedulerDataOutput>
    {
        private readonly ISchedulerDataProvider _schedulerDataProvider;

        public StopSchedulerCommand(ISchedulerProvider schedulerProvider, ISchedulerDataProvider schedulerDataProvider) : base(schedulerProvider)
        {
            _schedulerDataProvider = schedulerDataProvider;
        }

        protected override void InternalExecute(NoInput input, SchedulerDataOutput output)
        {
            Scheduler.Shutdown(false);

            _schedulerDataProvider.Data.MapToOutput(output);
        }
    }
}