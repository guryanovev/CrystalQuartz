/// <reference path="../Definitions/john-smith-latest.d.ts"/>
/// <reference path="../Definitions/lodash.d.ts"/>
/// <reference path="Models.ts"/>
/// <reference path="Services.ts"/>

class ApplicationViewModel {
    constructor(private commandService: SchedulerService) {
        this.scheduler = new SchedulerViewModel(commandService);
        this.commandProgress = new CommandProgressViewModel(commandService);
    }

    scheduler: SchedulerViewModel;
    commandProgress: CommandProgressViewModel;
    jobGroups = js.observableList<JobGroupViewModel>();

    setData(data: SchedulerData) {
        var groups = _.map(data.JobGroups, (group: JobGroup) => new JobGroupViewModel(group));
        
        this.scheduler.updateFrom(data);
        this.jobGroups.setValue(groups);
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

    constructor(private commandService: SchedulerService) {
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
}

class ManagableActivityViewModel {
    name: string;
    status = js.observableValue<ActivityStatus>();
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
    triggers = js.observableList<TriggerViewModel>();

    constructor(job: Job) {
        super(job);

        var triggers = _.map(job.Triggers, (trigger: Trigger) => new TriggerViewModel(trigger));

        this.triggers.setValue(triggers);
    }
}

class TriggerViewModel extends ManagableActivityViewModel {
    startDate = js.observableValue<NullableDate>();
    endDate = js.observableValue<NullableDate>();
    previousFireDate = js.observableValue<NullableDate>();
    nextFireDate = js.observableValue<NullableDate>();

    constructor(trigger: Trigger) {
        super(trigger);

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