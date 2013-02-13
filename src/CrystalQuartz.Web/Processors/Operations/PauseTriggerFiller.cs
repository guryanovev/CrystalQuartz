namespace CrystalQuartz.Web.Processors.Operations
{
    using System.Web;
    using Core;
    using Core.SchedulerProviders;
    using Quartz;

    public class PauseTriggerFiller : OperationFiller
    {
        public PauseTriggerFiller(ISchedulerProvider schedulerProvider)
            : base(schedulerProvider)
        {
        }

        protected override void DoAction(HttpResponseBase response, HttpContextBase context)
        {
            var trigger = context.Request.Params["trigger"];
            var jobGroup = context.Request.Params["group"];
            _schedulerProvider.Scheduler.PauseTrigger(new TriggerKey(trigger, jobGroup));
        }
    }
}