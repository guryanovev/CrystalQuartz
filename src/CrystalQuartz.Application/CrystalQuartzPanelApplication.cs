using System;
using System.Collections.Generic;
using System.Reflection;
using CrystalQuartz.Application.Comands;
using CrystalQuartz.Core;
using CrystalQuartz.WebFramework.Config;
using CrystalQuartz.WebFramework.Request;
using CrystalQuartz.Application.Comands.Serialization;
using CrystalQuartz.Core.Contracts;
using CrystalQuartz.Core.SchedulerProviders;

namespace CrystalQuartz.Application
{
    public class CrystalQuartzPanelApplication : WebFramework.Application
    {
        private readonly ISchedulerProvider _schedulerProvider;
        private readonly Options _options;

        public CrystalQuartzPanelApplication(
            ISchedulerProvider schedulerProvider, 
            Options options) :
            
            base(Assembly.GetAssembly(typeof(CrystalQuartzPanelApplication)), 
                "CrystalQuartz.Application.Content.")
        {
            _schedulerProvider = schedulerProvider;
            _options = options;
        }

        public override IHandlerConfig Config
        {
            get
            {
                var initializer = new ShedulerHostInitializer(_schedulerProvider, _options);

                Func<SchedulerHost> hostProvider = () => initializer.SchedulerHost;

                if (!_options.LazyInit)
                {
                    var forcedHost = hostProvider.Invoke();
                }

                var schedulerDataSerializer = new SchedulerDataOutputSerializer();

                return this

                    .WithHandler(new FileRequestHandler(Assembly.GetExecutingAssembly(), Context.DefautResourcePrefix))

                    /*
                     * Trigger commands
                     */
                    .WhenCommand("pause_trigger")          .Do(new PauseTriggerCommand(hostProvider), schedulerDataSerializer)
                    .WhenCommand("resume_trigger")         .Do(new ResumeTriggerCommand(hostProvider), schedulerDataSerializer)
                    .WhenCommand("delete_trigger")         .Do(new DeleteTriggerCommand(hostProvider), schedulerDataSerializer)
                                                           
                    .WhenCommand("add_trigger")            .Do(new AddTriggerCommand(hostProvider, _options.JobDataMapInputTypes), new AddTriggerOutputSerializer())
                                                           
                    /*                                     
                     * Group commands                      
                     */                                    
                    .WhenCommand("pause_group")            .Do(new PauseGroupCommand(hostProvider), schedulerDataSerializer)
                    .WhenCommand("resume_group")           .Do(new ResumeGroupCommand(hostProvider), schedulerDataSerializer)
                    .WhenCommand("delete_group")           .Do(new DeleteGroupCommand(hostProvider), schedulerDataSerializer)
                                                           
                    /*                                     
                     * Job commands                        
                     */                                    
                    .WhenCommand("pause_job")              .Do(new PauseJobCommand(hostProvider), schedulerDataSerializer)
                    .WhenCommand("resume_job")             .Do(new ResumeJobCommand(hostProvider), schedulerDataSerializer)
                    .WhenCommand("delete_job")             .Do(new DeleteJobCommand(hostProvider), schedulerDataSerializer)
                    .WhenCommand("execute_job")            .Do(new ExecuteNowCommand(hostProvider), schedulerDataSerializer)
                    
                    /* 
                     * Scheduler commands
                     */
                    .WhenCommand("start_scheduler")       .Do(new StartSchedulerCommand(hostProvider), schedulerDataSerializer)
                    .WhenCommand("stop_scheduler")        .Do(new StopSchedulerCommand(hostProvider), schedulerDataSerializer)
                    .WhenCommand("get_scheduler_details") .Do(new GetSchedulerDetailsCommand(hostProvider), new SchedulerDetailsOutputSerializer())
                    .WhenCommand("pause_scheduler")       .Do(new PauseAllCommand(hostProvider), schedulerDataSerializer)
                    .WhenCommand("resume_scheduler")      .Do(new ResumeAllCommand(hostProvider), schedulerDataSerializer)
                    .WhenCommand("standby_scheduler")     .Do(new StandbySchedulerCommand(hostProvider), schedulerDataSerializer)

                    /* 
                     * Misc commands
                     */
                    .WhenCommand("get_data")                 .Do(new GetDataCommand(hostProvider), schedulerDataSerializer)
                    .WhenCommand("get_env")                  .Do(new GetEnvironmentDataCommand(hostProvider, _options.CustomCssUrl, _options.TimelineSpan, _options.FrameworkVersion), new EnvironmentDataOutputSerializer())
                    .WhenCommand("get_job_details")          .Do(new GetJobDetailsCommand(hostProvider, _options.JobDataMapTraversingOptions), new JobDetailsOutputSerializer())
                    .WhenCommand("get_trigger_details")      .Do(new GetTriggerDetailsCommand(hostProvider, _options.JobDataMapTraversingOptions), new TriggerDetailsOutputSerializer())
                    .WhenCommand("get_input_types")          .Do(new GetInputTypesCommand(_options.JobDataMapInputTypes), new InputTypeOptionsSerializer())
                    .WhenCommand("get_input_type_variants")  .Do(new GetInputTypeVariantsCommand(_options.JobDataMapInputTypes), new InputTypeVariantOutputSerializer())
                    
                    .Else()                          .MapTo("index.html");
            }
        }
    }
}