/// <reference path="../Definitions/john-smith-latest.d.ts"/>
/// <reference path="../Definitions/lodash.d.ts"/>
/// <reference path="Models.ts"/>

class ApplicationViewModel {
    scheduler = js.observableValue<SchedulerViewModel>();
    jobGroups = js.observableList<JobGroupViewModel>();

    setData(data: SchedulerData) {
        var schedulerViewModel = new SchedulerViewModel();
        schedulerViewModel.name = data.Name;
        schedulerViewModel.instanceId = data.InstanceId;
        schedulerViewModel.status = data.Status;
        schedulerViewModel.runningSince = new NullableDate(data.RunningSince);
        schedulerViewModel.jobsTotal = data.JobsTotal;
        schedulerViewModel.jobsExecuted = data.JobsExecuted;
        schedulerViewModel.canStart = data.CanStart;
        schedulerViewModel.canShutdown = data.CanShutdown;
        schedulerViewModel.isRemote = data.IsRemote;
        schedulerViewModel.schedulerType = data.SchedulerTypeName;

        var groups = _.map(data.JobGroups, (group: JobGroup) => new JobGroupViewModel(group));
        
        this.scheduler.setValue(schedulerViewModel);
        this.jobGroups.setValue(groups);
    }
}

class SchedulerViewModel {
    name: string;
    instanceId: string;
    status: string;
    runningSince: NullableDate;
    jobsTotal: number;
    jobsExecuted: number;
    canStart: boolean;
    canShutdown: boolean;
    isRemote: boolean;
    schedulerType: string;
}

class ManagableActivityViewModel {
    name: string;
    status = js.observableValue<string>();
    canStart = js.observableValue<boolean>();
    canPause = js.observableValue<boolean>();

    constructor(
        activity: ManagableActivity) {

        this.name = activity.Name;
        this.status.setValue(activity.Status);
        this.canStart.setValue(activity.CanStart);
        this.canPause.setValue(activity.CanPause);
    }
}

class JobGroupViewModel extends ManagableActivityViewModel {
    jobs = js.observableList<JobViewModel>();

    constructor(group: JobGroup) {
        super(group);

        var jobs = _.map(group.Jobs, (job: Job) => new JobViewModel(job));

        this.jobs.setValue(jobs);
    }
}

class JobViewModel extends ManagableActivityViewModel {
}