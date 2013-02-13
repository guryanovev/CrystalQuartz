using System.Web;
using CrystalQuartz.Core.SchedulerProviders;

namespace CrystalQuartz.Web.Processors.Operations
{
    public class TriggerJobOperationFiller : OperationFiller
    {
        public TriggerJobOperationFiller(ISchedulerProvider schedulerProvider) : base(schedulerProvider)
        {
        }

        protected override void DoAction(HttpResponseBase response, HttpContextBase context)
        {
            var jobGroup = context.Request.Params["group"];
            var jobName = context.Request.Params["job"];

            _schedulerProvider.Scheduler.TriggerJob(jobName, jobGroup);
        }
    }
}