namespace CrystalQuartz.Application.Comands
{
    using CrystalQuartz.Application.Comands.Inputs;
    using CrystalQuartz.Application.Comands.Outputs;
    using CrystalQuartz.Core;
    using CrystalQuartz.Core.SchedulerProviders;

    public class GetSchedulerDetailsCommand : AbstractSchedulerCommand<NoInput, SchedulerDetailsOutput>
    {
        public GetSchedulerDetailsCommand(ISchedulerProvider schedulerProvider, ISchedulerDataProvider schedulerDataProvider) : base(schedulerProvider, schedulerDataProvider)
        {
        }

        protected override void InternalExecute(NoInput input, SchedulerDetailsOutput output)
        {
            output.SchedulerDetails = SchedulerDataProvider.GetSchedulerDetails();
        }
    }
}