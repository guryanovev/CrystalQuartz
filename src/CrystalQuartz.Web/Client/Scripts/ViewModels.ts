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

        var groups = _.map(data.JobGroups, (group: JobGroup) => {
            return new JobGroupViewModel(
                group.Name,
                group.Status,
                group.CanStart,
                group.CanPause);
        });
        
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
    status = js.observableValue<string>();
    canStart = js.observableValue<boolean>();
    canPause = js.observableValue<boolean>();

    constructor(
        public name: string,
        status: string,
        canStart: boolean,
        canPause: boolean) {

        this.status.setValue(status);
        this.canStart.setValue(canStart);
        this.canPause.setValue(canPause);
    }
}

class JobGroupViewModel extends ManagableActivityViewModel {
}