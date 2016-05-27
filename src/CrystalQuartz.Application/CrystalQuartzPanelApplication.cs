namespace CrystalQuartz.Application
{
    using System.Collections.Generic;
    using System.Reflection;
    using System.Web.Script.Serialization;
    using CrystalQuartz.Application.Comands;
    using CrystalQuartz.Core;
    using CrystalQuartz.Core.SchedulerProviders;
    using CrystalQuartz.WebFramework.Config;
    using CrystalQuartz.WebFramework.Request;

    public class CrystalQuartzPanelApplication : WebFramework.Application
    {
        private readonly ISchedulerProvider _schedulerProvider;
        private readonly ISchedulerDataProvider _schedulerDataProvider;
        private readonly CrystalQuartzOptions _options;

        public CrystalQuartzPanelApplication(
            ISchedulerProvider schedulerProvider, 
            ISchedulerDataProvider schedulerDataProvider, 
            CrystalQuartzOptions options) :
            
            base(Assembly.GetAssembly(typeof(CrystalQuartzPanelApplication)), 
                "CrystalQuartz.Application.Content.")
        {
            _schedulerProvider = schedulerProvider;
            _schedulerDataProvider = schedulerDataProvider;
            _options = options;
        }

        public override IHandlerConfig Config
        {
            get
            {
                _schedulerProvider.Init();

                Context.JavaScriptSerializer.RegisterConverters(new List<JavaScriptConverter>
                {
                    new DateTimeConverter(),
                    new ActivityStatusConverter()
                });

                return this

                    .WithHandler(new FileRequestHandler(Assembly.GetExecutingAssembly(), Context.DefautResourcePrefix))

                    /*
                     * Trigger commands
                     */
                    .WhenCommand("pause_trigger")    .Do(new PauseTriggerCommand(_schedulerProvider, _schedulerDataProvider))
                    .WhenCommand("resume_trigger")   .Do(new ResumeTriggerCommand(_schedulerProvider, _schedulerDataProvider))
                    .WhenCommand("delete_trigger")   .Do(new DeleteTriggerCommand(_schedulerProvider, _schedulerDataProvider))

                    /*
                     * Group commands
                     */
                    .WhenCommand("pause_group")      .Do(new PauseGroupCommand(_schedulerProvider, _schedulerDataProvider))
                    .WhenCommand("resume_group")     .Do(new ResumeGroupCommand(_schedulerProvider, _schedulerDataProvider))
                    .WhenCommand("delete_group")     .Do(new DeleteGroupCommand(_schedulerProvider, _schedulerDataProvider))

                    /*
                     * Job commands
                     */
                    .WhenCommand("pause_job")        .Do(new PauseJobCommand(_schedulerProvider, _schedulerDataProvider))
                    .WhenCommand("resume_job")       .Do(new ResumeJobCommand(_schedulerProvider, _schedulerDataProvider))
                    .WhenCommand("delete_job")       .Do(new DeleteJobCommand(_schedulerProvider, _schedulerDataProvider))
                    .WhenCommand("execute_job")      .Do(new ExecuteNowCommand(_schedulerProvider, _schedulerDataProvider))
                    
                    /* 
                     * Scheduler commands
                     */
                    .WhenCommand("start_scheduler")  .Do(new StartSchedulerCommand(_schedulerProvider, _schedulerDataProvider))
                    .WhenCommand("stop_scheduler")   .Do(new StopSchedulerCommand(_schedulerProvider, _schedulerDataProvider))

                    /* 
                     * Misc commands
                     */
                    .WhenCommand("get_data")         .Do(new GetDataCommand(_schedulerProvider, _schedulerDataProvider))
                    .WhenCommand("get_env")          .Do(new GetEnvironmentDataCommand(_options.CustomCssUrl))
                    .WhenCommand("get_job_details")  .Do(new GetJobDetailsCommand(_schedulerProvider, _schedulerDataProvider))
                    
                    .Else()                          .MapTo("index.html");
            }
        }
    }
}