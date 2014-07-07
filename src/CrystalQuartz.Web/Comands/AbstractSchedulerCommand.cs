using CrystalQuartz.Core.SchedulerProviders;
using CrystalQuartz.WebFramework.Commands;
using Quartz;

namespace CrystalQuartz.Web.Comands
{
    public abstract class AbstractSchedulerCommand<TInput> : AbstractCommand<TInput, CommandResult>
    {
        private readonly ISchedulerProvider _schedulerProvider;

        protected AbstractSchedulerCommand(ISchedulerProvider schedulerProvider)
        {
            _schedulerProvider = schedulerProvider;
        }

        protected IScheduler Scheduler
        {
            get { return _schedulerProvider.Scheduler; }
        }
    }
}