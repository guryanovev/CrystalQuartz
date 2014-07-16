/// <reference path="../Definitions/john-smith-latest.d.ts"/>
/// <reference path="../Definitions/lodash.d.ts"/>
/// <reference path="Models.ts"/>
/// <reference path="Services.ts"/>

class ApplicationViewModel {
    constructor(private applicationModel: ApplicationModel, private commandService: SchedulerService) {
        this.scheduler = new SchedulerViewModel(commandService, applicationModel);
        this.commandProgress = new CommandProgressViewModel(commandService);

        applicationModel.onDataChanged.listen(data => this.setData(data));
        commandService.onCommandFailed.listen(errorInfo => alert(errorInfo.errorMessage));
    }

    scheduler: SchedulerViewModel;
    commandProgress: CommandProgressViewModel;
    jobGroups = js.observableList<JobGroupViewModel>();

    private setData(data: SchedulerData) {
        //var groups = _.map(data.JobGroups, (group: JobGroup) => new JobGroupViewModel(group, this.commandService, this.applicationModel));
        
        this.scheduler.updateFrom(data);
        this.syncGroups(data.JobGroups);

        //this.jobGroups.setValue(groups);
    }

    private syncGroups(groups: JobGroup[]) {
        var existingGroups = this.jobGroups.getValue();

        var deletedGroups = _.filter(
            existingGroups,
            groupViewModel => _.every(groups, group => group.Name !== groupViewModel.name));

        var addedGroups = _.filter(
            groups,
            group => _.every(existingGroups, groupViewModel => groupViewModel.name !== group.Name));

        var updatedGroups = _.filter(
            existingGroups,
            groupViewModel => _.some(groups, group => group.Name === groupViewModel.name));

        var addedGroupViewModels = _.map(addedGroups, (group: JobGroup) => new JobGroupViewModel(group, this.commandService, this.applicationModel));

        console.log('deleted groups', deletedGroups);
        console.log('added groups', addedGroupViewModels);
        console.log('updated groups', updatedGroups);

        _.each(deletedGroups, groupViewModel => this.jobGroups.remove(groupViewModel));
        _.each(addedGroupViewModels, groupViewModel => this.jobGroups.add(groupViewModel));
        _.each(updatedGroups, groupViewModel => groupViewModel.updateFromActivity(_.find(groups, group => group.Name === groupViewModel.name)));
    }

    getCommandProgress() {
        return new CommandProgressViewModel(this.commandService);
    }
}

class SchedulerViewModel {
    name = js.observableValue<string>();
    instanceId = js.observableValue<string>();
    status = js.observableValue<string>();
    runningSince = js.observableValue<NullableDate>();
    jobsTotal = js.observableValue<number>();
    jobsExecuted = js.observableValue<number>();
    canStart = js.observableValue<boolean>();
    canShutdown = js.observableValue<boolean>();
    isRemote = js.observableValue<boolean>();
    schedulerType = js.observableValue<string>();

    constructor(private commandService: SchedulerService, private applicationModel: ApplicationModel) {
    }

    updateFrom(data: SchedulerData) {
        this.name.setValue(data.Name);
        this.instanceId.setValue(data.InstanceId);
        this.status.setValue(data.Status);
        this.runningSince.setValue(new NullableDate(data.RunningSince));
        this.jobsTotal.setValue(data.JobsTotal);
        this.jobsExecuted.setValue(data.JobsExecuted);
        this.canStart.setValue(data.CanStart);
        this.canShutdown.setValue(data.CanShutdown);
        this.isRemote.setValue(data.IsRemote);
        this.schedulerType.setValue(data.SchedulerTypeName);
    }

    startScheduler() {
        this.commandService
            .executeCommand(new StartSchedulerCommand())
            .done(data => this.updateFrom(data));
    }

    stopScheduler() {
        this.commandService
            .executeCommand(new StopSchedulerCommand())
            .done(data => this.updateFrom(data));
    }

    refreshData() {
        this.commandService
            .executeCommand(new GetDataCommand())
            .done(data => this.applicationModel.setData(data));
    }
}

class ManagableActivityViewModel {
    name: string;
    status = js.observableValue<ActivityStatus>();
    canStart = js.observableValue<boolean>();
    canPause = js.observableValue<boolean>();

    constructor(
        activity: ManagableActivity, public commandService: SchedulerService) {

        this.name = activity.Name;
        this.updateFromActivity(activity);
    }

    updateFromActivity(activity: ManagableActivity) {
        this.status.setValue(activity.Status);
        this.canStart.setValue(activity.CanStart);
        this.canPause.setValue(activity.CanPause);
    }
}

class JobGroupViewModel extends ManagableActivityViewModel {
    jobs = js.observableList<JobViewModel>();

    constructor(group: JobGroup, commandService: SchedulerService, private applicationModel: ApplicationModel) {
        super(group, commandService);

        var jobs = _.map(group.Jobs, (job: Job) => new JobViewModel(job, group, commandService, applicationModel));

        this.jobs.setValue(jobs);
    }
}

class JobViewModel extends ManagableActivityViewModel {
    triggers = js.observableList<TriggerViewModel>();
    details = js.observableValue<JobDetails>();

    constructor(job: Job, private group: JobGroup, commandService: SchedulerService, private applicationModel: ApplicationModel) {
        super(job, commandService);

        var triggers = _.map(job.Triggers, (trigger: Trigger) => new TriggerViewModel(trigger, job, commandService, applicationModel));

        this.triggers.setValue(triggers);
    }

    loadJobDetails() {
        this.commandService
            .executeCommand(new GetJobDetailsCommand(this.group.Name, this.name))
            .done(details => this.details.setValue(details));
    }
}


class TriggerViewModel extends ManagableActivityViewModel {
    startDate = js.observableValue<NullableDate>();
    endDate = js.observableValue<NullableDate>();
    previousFireDate = js.observableValue<NullableDate>();
    nextFireDate = js.observableValue<NullableDate>();

    constructor(trigger: Trigger, private job: Job, commandService: SchedulerService, private applicationModel: ApplicationModel) {
        super(trigger, commandService);

        this.updateFrom(trigger);
    }

    resume() {
        this.commandService
            .executeCommand(new ResumeTriggerCommand(this.job.GroupName, this.name))
            .done(data => this.applicationModel.setData(data));
    }

    pause() {
        this.commandService
            .executeCommand(new PauseTriggerCommand(this.job.GroupName, this.name))
            .done(data => this.applicationModel.setData(data));
    }

    public updateFrom(trigger: Trigger) {
        this.updateFromActivity(trigger);

        this.startDate.setValue(new NullableDate(trigger.StartDate));
        this.endDate.setValue(new NullableDate(trigger.EndDate));
        this.previousFireDate.setValue(new NullableDate(trigger.PreviousFireDate));
        this.nextFireDate.setValue(new NullableDate(trigger.NextFireDate));
    }
}

class CommandProgressViewModel {
    private _commands: ICommand<any>[] = [];

    active = js.observableValue<boolean>();
    commandsCount = js.observableValue<number>();
    currentCommand = js.observableValue<string>();

    constructor(private commandService: SchedulerService) {
        commandService.onCommandStart.listen(command => this.addCommand(command));
        commandService.onCommandComplete.listen(command => this.removeCommand(command));
    }

    private addCommand(command: ICommand<any>) {
        this._commands.push(command);
        this.updateState();
    }

    private removeCommand(command: ICommand<any>) {
        this._commands = _.filter(this._commands, c => c !== command);
        this.updateState();
    }

    private updateState() {
        this.active.setValue(this._commands.length > 0);
        this.commandsCount.setValue(this._commands.length);
        if (this._commands.length > 0) {
            this.currentCommand.setValue(_.last(this._commands).message);
        }
    }
}