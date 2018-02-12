using System.Linq;
using CrystalQuartz.Core.Contracts;

namespace CrystalQuartz.Application.Comands
{
    using System;
    using CrystalQuartz.Application.Comands.Outputs;
    using CrystalQuartz.WebFramework.Commands;

    public abstract class AbstractSchedulerCommand<TInput, TOutput> : AbstractCommand<TInput, TOutput> 
        where TOutput : CommandResultWithErrorDetails, new()
    {
        protected AbstractSchedulerCommand(Func<SchedulerHost> schedulerHostProvider)
        {
            SchedulerHostProvider = schedulerHostProvider;
        }

        protected Func<SchedulerHost> SchedulerHostProvider { get; }
        protected SchedulerHost SchedulerHost => SchedulerHostProvider.Invoke();

        public override object Execute(TInput input)
        {
            if (SchedulerHost.Faulted)
            {
                return new TOutput
                {
                    Success = false,
                    ErrorMessage = string.Join(Environment.NewLine, SchedulerHost.Errors)
                };
            }

            return base.Execute(input);
        }

        protected override void HandleError(Exception exception, TInput input, TOutput output)
        {
//            var schedulerProviderException = exception as SchedulerProviderException;
//            if (schedulerProviderException != null)
//            {
//                NameValueCollection properties = schedulerProviderException.SchedulerInitialProperties;
//
//                // todo
////                output.ErrorDetails = properties
////                    .AllKeys
////                    .Select(key => new Property(key, properties.Get(key)))
////                    .ToArray();
//            }
        }
    }
}