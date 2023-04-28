namespace CrystalQuartz.Application.Comands
{
    using System;
    using System.Linq;
    using System.Threading.Tasks;
    using CrystalQuartz.Application.Comands.Inputs;
    using CrystalQuartz.Application.Comands.Outputs;
    using CrystalQuartz.Core.Contracts;
    using CrystalQuartz.WebFramework.Commands;

    public class GetAllowedJobTypesCommand : AbstractCommand<NoInput, JobTypesOutput>
    {
        private readonly Func<SchedulerHost> _schedulerHostProvider;

        public GetAllowedJobTypesCommand(Func<SchedulerHost> schedulerHostProvider)
        {
            _schedulerHostProvider = schedulerHostProvider;
        }

        protected override async Task InternalExecute(NoInput input, JobTypesOutput output)
        {
            output.AllowedTypes = await _schedulerHostProvider().AllowedJobTypesRegistry.List();
        }
    }
}