namespace CrystalQuartz.Application.Commands
{
    using System.Threading.Tasks;
    using Inputs;

    public class GetDataCommand : AbstractOperationCommand<NoInput>
    {
        public GetDataCommand(ISchedulerHostProvider schedulerHostProvider) : base(schedulerHostProvider)
        {
        }

        protected override Task PerformOperation(NoInput input)
        {
            return AsyncUtils.CompletedTask();
        }
    }
}