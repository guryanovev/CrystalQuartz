using CrystalQuartz.Core;
using CrystalQuartz.Core.SchedulerProviders;
using CrystalQuartz.Web.Comands.Inputs;
using CrystalQuartz.Web.Comands.Outputs;
using CrystalQuartz.Web.Helpers;

namespace CrystalQuartz.Web.Comands
{
    public class StartSchedulerCommand : AbstractSchedulerCommand<NoInput, SchedulerDataOutput>
    {
        private readonly ISchedulerDataProvider _schedulerDataProvider;

        public StartSchedulerCommand(ISchedulerProvider schedulerProvider, ISchedulerDataProvider schedulerDataProvider) : base(schedulerProvider)
        {
            _schedulerDataProvider = schedulerDataProvider;
        }

        protected override void InternalExecute(NoInput input, SchedulerDataOutput output)
        {
            Scheduler.Start();
            _schedulerDataProvider.Data.MapToOutput(output);
        }
    }
}