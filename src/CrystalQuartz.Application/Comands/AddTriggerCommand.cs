using System;
using CrystalQuartz.Application.Comands.Inputs;
using CrystalQuartz.Application.Comands.Outputs;
using CrystalQuartz.Core;
using CrystalQuartz.Core.SchedulerProviders;
using Quartz;

namespace CrystalQuartz.Application.Comands
{
    public class AddTriggerCommand : AbstractSchedulerCommand<AddTriggerInput, CommandResultWithErrorDetails>
    {
        public AddTriggerCommand(
            ISchedulerProvider schedulerProvider, 
            ISchedulerDataProvider schedulerDataProvider) : base(schedulerProvider, schedulerDataProvider)
        {
        }

        protected override void InternalExecute(AddTriggerInput input, CommandResultWithErrorDetails output)
        {
            TriggerBuilder triggerBuilder = TriggerBuilder
                .Create()
                .ForJob(input.Job, input.Group);

            if (!string.IsNullOrEmpty(input.Name))
            {
                triggerBuilder = triggerBuilder.WithIdentity(input.Name);
            }

            switch (input.TriggerType)
            {
                case TriggerType.Simple:
                    triggerBuilder = triggerBuilder.WithSimpleSchedule(x =>
                    {
                        if (input.RepeatForever)
                        {
                            x.RepeatForever();
                        }
                        else
                        {
                            x.WithRepeatCount(input.RepeatCount);
                        }

                        x.WithInterval(TimeSpan.FromMilliseconds(input.RepeatInterval));
                    });
                    break;
                case TriggerType.Cron:
                    triggerBuilder = triggerBuilder.WithCronSchedule(input.CronExpression);
                    break;
                default:
                    throw new ArgumentOutOfRangeException();
            }

            Scheduler.ScheduleJob(triggerBuilder.Build());
        }
    }
}