using System.Web;
using CrystalQuartz.Core.SchedulerProviders;

namespace CrystalQuartz.Web.Processors.Operations
{
    using Quartz;

    public class TriggerJobOperationFiller : OperationFiller
    {
        public TriggerJobOperationFiller(ISchedulerProvider schedulerProvider) : base(schedulerProvider)
        {
        }

        protected override void DoAction(HttpResponseBase response, HttpContextBase context)
        {
            var jobGroup = context.Request.Params["group"];
            var jobName = context.Request.Params["job"];

            // todo move to core
            _schedulerProvider.Scheduler.TriggerJob(new JobKey(jobName, jobGroup));
        }
    }
}