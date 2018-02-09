using System;
using CrystalQuartz.Core.Contracts;
using CrystalQuartz.Core.Quartz3;
using CrystalQuartz.Core.Quarz2;
using CrystalQuartz.Core.SchedulerProviders;

namespace CrystalQuartz.Application
{
    using System.Collections.Generic;
    using System.Reflection;
    using System.Web.Script.Serialization;
    using CrystalQuartz.Application.Comands;
    using CrystalQuartz.Core;
    using CrystalQuartz.Core.Timeline;
    using CrystalQuartz.WebFramework.Config;
    using CrystalQuartz.WebFramework.Request;

    public class CrystalQuartzPanelApplication : WebFramework.Application
    {
        private readonly ISchedulerProvider _schedulerProvider;
        private readonly CrystalQuartzOptions _options;

//        private readonly ISchedulerProvider _schedulerProvider;
//        private readonly ISchedulerClerk _schedulerDataProvider;
//        private readonly SchedulerHubFactory _hubFactory;
//        private readonly CrystalQuartzOptions _options;

        public CrystalQuartzPanelApplication(ISchedulerProvider schedulerProvider, CrystalQuartzOptions options) :
            
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
                ISchedulerEngine schedulerEngine = null;
                Type quartzSchedulerType = Type.GetType("Quartz.IScheduler, Quartz");
                if (quartzSchedulerType != null && quartzSchedulerType.Assembly.GetName().Version.Major < 3)
                {
                    schedulerEngine = new Quartz2SchedulerEngine();
                }
                else
                {
                    schedulerEngine = new Quartz3SchedulerEngine();
                }

                var initializer = new ShedulerHostInitializer(schedulerEngine, _schedulerProvider, new Options());

                Func<SchedulerHost> hostProvider = () => initializer.SchedulerHost;

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
                    .WhenCommand("get_env")               .Do(new GetEnvironmentDataCommand(hostProvider, null /*_options.CustomCssUrl */))
                    .WhenCommand("get_job_details")       .Do(new GetJobDetailsCommand(hostProvider))
                    
                    .Else()                          .MapTo("index.html");
            }
        }
    }
}