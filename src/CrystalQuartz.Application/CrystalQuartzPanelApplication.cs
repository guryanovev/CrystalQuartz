using System;
using CrystalQuartz.Core.Contracts;
using CrystalQuartz.Core.SchedulerProviders;

namespace CrystalQuartz.Application
{
    using System.Collections.Generic;
    using System.Reflection;
    using System.Web.Script.Serialization;
    using CrystalQuartz.Application.Comands;
    using CrystalQuartz.Core;
    using CrystalQuartz.WebFramework.Config;
    using CrystalQuartz.WebFramework.Request;

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

                Context.JavaScriptSerializer.RegisterConverters(new List<JavaScriptConverter>
                {
                    new DateTimeConverter(), // todo: remove? v3
                    new ActivityStatusConverter(),
                    new TypeConverter()
                });

                return this

                    .WithHandler(new FileRequestHandler(Assembly.GetExecutingAssembly(), Context.DefautResourcePrefix))

                    /*
                     * Trigger commands
                     */
                    .WhenCommand("pause_trigger")          .Do(new PauseTriggerCommand(hostProvider))
                    .WhenCommand("resume_trigger")         .Do(new ResumeTriggerCommand(hostProvider))
                    .WhenCommand("delete_trigger")         .Do(new DeleteTriggerCommand(hostProvider))
                                                           
                    .WhenCommand("add_trigger")            .Do(new AddTriggerCommand(hostProvider))
                                                           
                    /*                                     
                     * Group commands                      
                     */                                    
                    .WhenCommand("pause_group")            .Do(new PauseGroupCommand(hostProvider))
                    .WhenCommand("resume_group")           .Do(new ResumeGroupCommand(hostProvider))
                    .WhenCommand("delete_group")           .Do(new DeleteGroupCommand(hostProvider))
                                                           
                    /*                                     
                     * Job commands                        
                     */                                    
                    .WhenCommand("pause_job")              .Do(new PauseJobCommand(hostProvider))
                    .WhenCommand("resume_job")             .Do(new ResumeJobCommand(hostProvider))
                    .WhenCommand("delete_job")             .Do(new DeleteJobCommand(hostProvider))
                    .WhenCommand("execute_job")            .Do(new ExecuteNowCommand(hostProvider))
                    
                    /* 
                     * Scheduler commands
                     */
                    .WhenCommand("start_scheduler")       .Do(new StartSchedulerCommand(hostProvider))
                    .WhenCommand("stop_scheduler")        .Do(new StopSchedulerCommand(hostProvider))
                    .WhenCommand("get_scheduler_details") .Do(new GetSchedulerDetailsCommand(hostProvider))
                    .WhenCommand("pause_scheduler")       .Do(new PauseAllCommand(hostProvider))
                    .WhenCommand("resume_scheduler")      .Do(new ResumeAllCommand(hostProvider))
                    .WhenCommand("standby_scheduler")     .Do(new StandbySchedulerCommand(hostProvider))

                    /* 
                     * Misc commands
                     */
                    .WhenCommand("get_data")              .Do(new GetDataCommand(hostProvider))
                    .WhenCommand("get_env")               .Do(new GetEnvironmentDataCommand(hostProvider, _options.CustomCssUrl, _options.TimelineSpan, _options.FrameworkVersion))
                    .WhenCommand("get_job_details")       .Do(new GetJobDetailsCommand(hostProvider))
                    
                    .Else()                          .MapTo("index.html");
            }
        }
    }
}