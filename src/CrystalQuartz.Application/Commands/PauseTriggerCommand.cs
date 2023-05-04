﻿namespace CrystalQuartz.Application.Commands
{
    using System;
    using System.Threading.Tasks;
    using CrystalQuartz.Core.Contracts;
    using Inputs;

    public class PauseTriggerCommand : AbstractOperationCommand<TriggerInput>
    {
        public PauseTriggerCommand(SchedulerHost schedulerHost) : base(schedulerHost)
        {
        }

        protected override async Task PerformOperation(TriggerInput input)
        {
            await SchedulerHost.Commander.PauseTrigger(input.Trigger, input.Group);
        }
    }
}