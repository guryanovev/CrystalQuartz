using System;
using CrystalQuartz.Application.Comands.Inputs;
using CrystalQuartz.Application.Comands.Outputs;
using CrystalQuartz.Core.Contracts;
using CrystalQuartz.Core.Domain.TriggerTypes;
using CrystalQuartz.WebFramework.Commands;

namespace CrystalQuartz.Application.Comands
{
    public class AddTriggerCommand : AbstractSchedulerCommand<AddTriggerInput, CommandResult>
    {
        public AddTriggerCommand(Func<SchedulerHost> schedulerHostProvider) : base(schedulerHostProvider)
        {
        }

        protected override void InternalExecute(AddTriggerInput input, CommandResult output)
        {
            SchedulerHost.Commander.TriggerJob(input.Job, input.Group, input.Name, CreateTriggerType(input));
        }

        private static TriggerType CreateTriggerType(AddTriggerInput input)
        {
            switch (input.TriggerType)
            {
                case "Simple":
                    return new SimpleTriggerType(input.RepeatForever ? -1 : input.RepeatCount, input.RepeatInterval, 0 /* todo */);
                case "Cron":
                    return new CronTriggerType(input.CronExpression);
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }
    }
}