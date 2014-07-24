using CrystalQuartz.Core;
using CrystalQuartz.Core.SchedulerProviders;
using CrystalQuartz.Web.Comands.Inputs;

namespace CrystalQuartz.Web.Comands
{
    public class GetDataCommand : AbstractOperationCommand<NoInput>
    {
        public GetDataCommand(ISchedulerProvider schedulerProvider, ISchedulerDataProvider schedulerDataProvider) : base(schedulerProvider, schedulerDataProvider)
        {
        }

        protected override void PerformOperation(NoInput input)
        {
        }
    }
}