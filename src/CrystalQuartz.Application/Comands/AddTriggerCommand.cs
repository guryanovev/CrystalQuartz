using System;
using System.Threading.Tasks;
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

        protected override async Task InternalExecute(AddTriggerInput input, CommandResultWithErrorDetails output)
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
                case "Simple":
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
                case "Cron":
                    triggerBuilder = triggerBuilder.WithCronSchedule(input.CronExpression);
                    break;
                default:
                    throw new ArgumentOutOfRangeException();
            }

            await (await Scheduler().ConfigureAwait(false)).ScheduleJob(triggerBuilder.Build()).ConfigureAwait(false);
        }
    }
}