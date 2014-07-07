using System.Linq;
using CrystalQuartz.Core;
using CrystalQuartz.Core.Domain;
using CrystalQuartz.Web.Comands.Inputs;
using CrystalQuartz.Web.Comands.Outputs;
using CrystalQuartz.WebFramework.Commands;

namespace CrystalQuartz.Web.Comands
{
    public class GetDataCommand : AbstractCommand<NoInput, SchedulerDataOutput>
    {
        private readonly ISchedulerDataProvider _schedulerDataProvider;

        public GetDataCommand(ISchedulerDataProvider schedulerDataProvider)
        {
            _schedulerDataProvider = schedulerDataProvider;
        }

        protected override void InternalExecute(NoInput input, SchedulerDataOutput output)
        {
            SchedulerData schedulerData = _schedulerDataProvider.Data;

            output.InstanceId = schedulerData.InstanceId;
            output.IsRemote = schedulerData.IsRemote;
            output.JobGroups = schedulerData.JobGroups.ToArray();
            output.JobsExecuted = schedulerData.JobsExecuted;
            output.JobsTotal = schedulerData.JobsTotal;
            output.Name = schedulerData.Name;
            output.RunningSince = schedulerData.RunningSince;
            output.SchedulerTypeName = schedulerData.SchedulerType.Name;
            output.Status = schedulerData.Status;
            output.TriggerGroups = schedulerData.TriggerGroups.ToArray();
        }
    }
}