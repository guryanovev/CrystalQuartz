namespace CrystalQuartz.Application.Commands
{
    using System;
    using System.Threading.Tasks;
    using CrystalQuartz.Core.Contracts;
    using CrystalQuartz.WebFramework.Commands;
    using Inputs;
    using Outputs;

    public class GetAllowedJobTypesCommand : AbstractCommand<NoInput, JobTypesOutput>
    {
        private readonly ISchedulerHostProvider _schedulerHostProvider;

        public GetAllowedJobTypesCommand(ISchedulerHostProvider schedulerHostProvider)
        {
            _schedulerHostProvider = schedulerHostProvider;
        }

        protected override async Task InternalExecute(NoInput input, JobTypesOutput output)
        {
            output.AllowedTypes = await _schedulerHostProvider.SchedulerHost.AllowedJobTypesRegistry.List();
        }
    }
}