using System;
using CrystalQuartz.Application.Comands.Inputs;
using CrystalQuartz.Application.Comands.Outputs;
using CrystalQuartz.Core.Contracts;
using CrystalQuartz.Core.Domain.TriggerTypes;

namespace CrystalQuartz.Application.Comands
{
    using System.Collections.Generic;
    using System.Linq;
    using CrystalQuartz.Core.Domain.ObjectInput;

    public class AddTriggerCommand : AbstractSchedulerCommand<AddTriggerInput, AddTriggerOutput>
    {
        private readonly RegisteredInputType[] _registeredInputTypes;
        private readonly Type[] _allowedJobTypes;

        public AddTriggerCommand(
            Func<SchedulerHost> schedulerHostProvider, 
            RegisteredInputType[] registeredInputTypes, 
            Type[] allowedJobTypes) : base(schedulerHostProvider)
        {
            _registeredInputTypes = registeredInputTypes;
            _allowedJobTypes = allowedJobTypes;
        }

        protected override void InternalExecute(AddTriggerInput input, AddTriggerOutput output)
        {
            IDictionary<string, object> jobDataMap = null;

            if (input.JobDataMap != null)
            {
                jobDataMap = new Dictionary<string, object>();

                IDictionary<string, string> validationErrors = new Dictionary<string, string>();

                foreach (JobDataItem item in input.JobDataMap)
                {
                    RegisteredInputType inputType = _registeredInputTypes.FirstOrDefault(x => x.InputType.Code == item.InputTypeCode);
                    if (inputType == null)
                    {
                        /*
                         * We can only get here if client-side input type
                         * definitions are not in sync with server-side.
                         */
                        validationErrors[item.Key] = "Unknown input type: " + item.InputTypeCode;
                    }
                    else
                    {
                        try
                        {
                            var value = inputType.Converter == null
                                ? item.Value
                                : inputType.Converter.Convert(item.Value);

                            jobDataMap[item.Key] = value;
                        }
                        catch (Exception ex)
                        {
                            validationErrors[item.Key] = ex.Message;
                        }
                    }
                }

                if (validationErrors.Any())
                {
                    output.ValidationErrors = validationErrors;

                    return;
                }
            }

            if (!string.IsNullOrEmpty(input.JobClass))
            {
                Type jobType = Type.GetType(input.JobClass, true);

                if (!_allowedJobTypes.Contains(jobType))
                {
                    output.Success = false;
                    output.ErrorMessage = "Job type " + jobType.FullName + " is not allowed";
                    return;
                }

                SchedulerHost.Commander.ScheduleJob(
                    input.Job,
                    input.Group,
                    jobType,
                    input.Name,
                    CreateTriggerType(input),
                    jobDataMap);
            }
            else
            {
                if (string.IsNullOrEmpty(input.Job))
                {
                    output.Success = false;
                    output.ErrorMessage = "Job Name is required when adding trigger to an existing job";
                }
                else
                {
                    SchedulerHost.Commander.ScheduleJob(
                        input.Job,
                        input.Group,
                        input.Name,
                        CreateTriggerType(input),
                        jobDataMap);
                }
            }
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