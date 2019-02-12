namespace CrystalQuartz.Application.Comands
{
    using System;
    using CrystalQuartz.Application.Comands.Inputs;
    using CrystalQuartz.Application.Comands.Outputs;
    using CrystalQuartz.WebFramework.Commands;

    public class GetAllowedJobTypesCommand : AbstractCommand<NoInput, JobTypesOutput>
    {
        private readonly Type[] _allowedJobTypes;

        public GetAllowedJobTypesCommand(Type[] allowedJobTypes)
        {
            _allowedJobTypes = allowedJobTypes;
        }

        protected override void InternalExecute(NoInput input, JobTypesOutput output)
        {
            output.AllowedTypes = _allowedJobTypes;
        }
    }
}