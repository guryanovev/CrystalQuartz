using System;
using System.Collections.Generic;
using System.Reflection;
using CrystalQuartz.Core;
using CrystalQuartz.WebFramework.Config;
using CrystalQuartz.WebFramework.Request;
using CrystalQuartz.Core.Contracts;
using CrystalQuartz.Core.SchedulerProviders;

namespace CrystalQuartz.Application
{
    using System.Threading.Tasks;
    using Commands;
    using Commands.Serialization;
    using WebFramework.Utils;

    public class CrystalQuartzPanelApplication : WebFramework.Application
    {
        private readonly ISchedulerProvider _schedulerProvider;
        private readonly Options _options;

        public CrystalQuartzPanelApplication(
            ISchedulerProvider schedulerProvider,
            Options options) :

            base(Assembly.GetAssembly(typeof(CrystalQuartzPanelApplication)),
                "CrystalQuartz.Application.Content.",
                options.ErrorAction)
        {
            _schedulerProvider = schedulerProvider;
            _options = options;
        }

        public override async Task<IHandlerConfig> Configure()
        {
            var initializer = new SchedulerHostInitializer(_schedulerProvider, _options);

            SchedulerHost schedulerHost = await initializer.CreateSchedulerHost();

            var schedulerDataSerializer = new SchedulerDataOutputSerializer();

            return this

                .WithHandler(new FileRequestHandler(Assembly.GetExecutingAssembly(), Context.DefautResourcePrefix))

                /*
                 * Trigger commands
                 */
                .WhenCommand("pause_trigger").Do(new PauseTriggerCommand(schedulerHost), schedulerDataSerializer)
                .WhenCommand("resume_trigger").Do(new ResumeTriggerCommand(schedulerHost), schedulerDataSerializer)
                .WhenCommand("delete_trigger").Do(new DeleteTriggerCommand(schedulerHost), schedulerDataSerializer)

                .WhenCommand("add_trigger").Do(
                    new AddTriggerCommand(schedulerHost, _options.JobDataMapInputTypes),
                    new AddTriggerOutputSerializer())

                /*                                     
                 * Group commands                      
                 */
                .WhenCommand("pause_group").Do(new PauseGroupCommand(schedulerHost), schedulerDataSerializer)
                .WhenCommand("resume_group").Do(new ResumeGroupCommand(schedulerHost), schedulerDataSerializer)
                .WhenCommand("delete_group").Do(new DeleteGroupCommand(schedulerHost), schedulerDataSerializer)

                /*                                     
                 * Job commands                        
                 */
                .WhenCommand("pause_job").Do(new PauseJobCommand(schedulerHost), schedulerDataSerializer)
                .WhenCommand("resume_job").Do(new ResumeJobCommand(schedulerHost), schedulerDataSerializer)
                .WhenCommand("delete_job").Do(new DeleteJobCommand(schedulerHost), schedulerDataSerializer)
                .WhenCommand("execute_job").Do(new ExecuteNowCommand(schedulerHost), schedulerDataSerializer)

                /* 
                 * Scheduler commands
                 */
                .WhenCommand("start_scheduler").Do(new StartSchedulerCommand(schedulerHost), schedulerDataSerializer)
                .WhenCommand("stop_scheduler").Do(new StopSchedulerCommand(schedulerHost), schedulerDataSerializer)
                .WhenCommand("get_scheduler_details").Do(new GetSchedulerDetailsCommand(schedulerHost), new SchedulerDetailsOutputSerializer())
                .WhenCommand("pause_scheduler").Do(new PauseAllCommand(schedulerHost), schedulerDataSerializer)
                .WhenCommand("resume_scheduler").Do(new ResumeAllCommand(schedulerHost), schedulerDataSerializer)
                .WhenCommand("standby_scheduler").Do(new StandbySchedulerCommand(schedulerHost), schedulerDataSerializer)

                /* 
                 * Misc commands
                 */
                .WhenCommand("get_data").Do(new GetDataCommand(schedulerHost), schedulerDataSerializer)
                .WhenCommand("get_env").Do(new GetEnvironmentDataCommand(schedulerHost, _options.CustomCssUrl, _options.TimelineSpan, _options.FrameworkVersion), new EnvironmentDataOutputSerializer())
                .WhenCommand("get_job_details").Do(new GetJobDetailsCommand(schedulerHost, _options.JobDataMapTraversingOptions), new JobDetailsOutputSerializer())
                .WhenCommand("get_trigger_details").Do(new GetTriggerDetailsCommand(schedulerHost, _options.JobDataMapTraversingOptions), new TriggerDetailsOutputSerializer())
                .WhenCommand("get_input_types").Do(new GetInputTypesCommand(_options.JobDataMapInputTypes), new InputTypeOptionsSerializer())
                .WhenCommand("get_input_type_variants").Do(new GetInputTypeVariantsCommand(_options.JobDataMapInputTypes), new InputTypeVariantOutputSerializer())
                .WhenCommand("get_job_types").Do(new GetAllowedJobTypesCommand(schedulerHost), new JobTypesOutputSerializer())

                .Else().MapTo("index.html");
        }
    }
}