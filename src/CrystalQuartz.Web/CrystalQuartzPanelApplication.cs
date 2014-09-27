namespace CrystalQuartz.Web
{
    using System.Collections.Generic;
    using System.Reflection;
    using System.Web.Script.Serialization;
    using CrystalQuartz.Core;
    using CrystalQuartz.Core.SchedulerProviders;
    using CrystalQuartz.Web.Comands;
    using CrystalQuartz.WebFramework;
    using CrystalQuartz.WebFramework.Config;

    public class CrystalQuartzPanelApplication : Application
    {
        private readonly ISchedulerProvider _schedulerProvider;
        private readonly ISchedulerDataProvider _schedulerDataProvider;

        public CrystalQuartzPanelApplication(ISchedulerProvider schedulerProvider, ISchedulerDataProvider schedulerDataProvider) :
            base(Assembly.GetAssembly(typeof(CrystalQuartzPanelApplication)), "CrystalQuartz.Web.Content.")
        {
            _schedulerProvider = schedulerProvider;
            _schedulerDataProvider = schedulerDataProvider;
        }

        public override IHandlerConfig Config
        {
            get
            {
                Context.JavaScriptSerializer.RegisterConverters(new List<JavaScriptConverter>
                {
                    new DateTimeConverter(),
                    new ActivityStatusConverter()
                });

                return this
                    /*
                     * Trigger commands
                     */
                    .WhenCommand("pause_trigger")    .Do(new PauseTriggerCommand(_schedulerProvider, _schedulerDataProvider))
                    .WhenCommand("resume_trigger")   .Do(new ResumeTriggerCommand(_schedulerProvider, _schedulerDataProvider))

                    /*
                     * Group commands
                     */
                    .WhenCommand("pause_group")      .Do(new PauseGroupCommand(_schedulerProvider, _schedulerDataProvider))
                    .WhenCommand("resume_group")     .Do(new ResumeGroupCommand(_schedulerProvider, _schedulerDataProvider))

                    /*
                     * Job commands
                     */
                    .WhenCommand("pause_job")        .Do(new PauseJobCommand(_schedulerProvider, _schedulerDataProvider))
                    .WhenCommand("resume_job")       .Do(new ResumeJobCommand(_schedulerProvider, _schedulerDataProvider))
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
                    .WhenCommand("get_env")          .Do(new GetEnvironmentDataCommand())
                    .WhenCommand("get_job_details")  .Do(new GetJobDetailsCommand(_schedulerProvider, _schedulerDataProvider))
                    
                    .Else()                          .MapTo("index.html");
            }
        }
    }
}