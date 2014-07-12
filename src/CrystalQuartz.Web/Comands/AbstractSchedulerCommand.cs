using CrystalQuartz.Core;
using CrystalQuartz.Core.Domain;
using CrystalQuartz.Core.SchedulerProviders;
using CrystalQuartz.WebFramework.Commands;
using Quartz;

namespace CrystalQuartz.Web.Comands
{
    public abstract class AbstractSchedulerCommand<TInput, TOutput> : AbstractCommand<TInput, TOutput> 
        where TOutput : CommandResult, new()
    {
        private readonly ISchedulerProvider _schedulerProvider;
        private readonly ISchedulerDataProvider _schedulerDataProvider;

        protected AbstractSchedulerCommand(ISchedulerProvider schedulerProvider, ISchedulerDataProvider schedulerDataProvider)
        {
            _schedulerProvider = schedulerProvider;
            _schedulerDataProvider = schedulerDataProvider;
        }

        protected IScheduler Scheduler
        {
            get { return _schedulerProvider.Scheduler; }
        }

        protected ISchedulerDataProvider SchedulerDataProvider
        {
            get { return _schedulerDataProvider; }
        }
    }
}