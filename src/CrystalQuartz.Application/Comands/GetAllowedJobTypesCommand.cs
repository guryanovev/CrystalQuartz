namespace CrystalQuartz.Application.Comands
{
    using System;
    using System.Linq;
    using CrystalQuartz.Application.Comands.Inputs;
    using CrystalQuartz.Application.Comands.Outputs;
    using CrystalQuartz.Core.Contracts;
    using CrystalQuartz.WebFramework.Commands;

    public class GetAllowedJobTypesCommand : AbstractCommand<NoInput, JobTypesOutput>
    {
        private readonly Func<SchedulerHost> _schedulerHostProvider;
        //private readonly Type[] _allowedJobTypes;

        public GetAllowedJobTypesCommand(Func<SchedulerHost> schedulerHostProvider)
        {
            _schedulerHostProvider = schedulerHostProvider;
//            _allowedJobTypes = allowedJobTypes;
        }

        protected override void InternalExecute(NoInput input, JobTypesOutput output)
        {
            output.AllowedTypes = _schedulerHostProvider().AllowedJobTypesRegistry.List();

//                _allowedJobTypes
//                .Concat(_schedulerHostProvider().Clerk.GetScheduledJobTypes())
//                .Distinct()
//                .ToArray();
        }
    }
}