/// <reference path="../Definitions/john-smith-latest.d.ts"/>
/// <reference path="../Definitions/lodash.d.ts"/>
/// <reference path="Models.ts"/>
/// <reference path="Services.ts"/>

class ApplicationViewModel implements js.IViewModel {
    private groupsSynchronizer: ActivitiesSynschronizer<JobGroup, JobGroupViewModel>;

    constructor(private applicationModel: ApplicationModel, private commandService: SchedulerService) {
        this.scheduler = new SchedulerViewModel(commandService, applicationModel);
        this.commandProgress = new CommandProgressViewModel(commandService);

        applicationModel.onDataChanged.listen(data => this.setData(data));

        this.groupsSynchronizer = new ActivitiesSynschronizer<JobGroup, JobGroupViewModel>(
            (group: JobGroup, groupViewModel: JobGroupViewModel) => group.Name === groupViewModel.name,
            (group: JobGroup) => new JobGroupViewModel(group, this.commandService, this.applicationModel),
            this.jobGroups);
    }

    scheduler: SchedulerViewModel;
    commandProgress: CommandProgressViewModel;
    jobGroups = js.observableList<JobGroupViewModel>();
    environment = js.observableValue<EnvironmentData>();

    private setData(data: SchedulerData) {
        this.scheduler.updateFrom(data);
        this.groupsSynchronizer.sync(data.JobGroups);
    }

    getCommandProgress() {
        return this.commandProgress;
    }

    getError() {
        return new ErrorViewModel(this.commandService);
    }

    setEnvoronmentData(data: EnvironmentData) {
        this.environment.setValue(data);
    }
}

class ErrorViewModel implements js.IViewModel {
    message = js.observableValue<string>();
    details = js.observableList<Property>();
    isActive = js.observableValue<boolean>();

    constructor(private commandService: SchedulerService) {
        this.isActive.setValue(false);
    }

    initState() {
        this.commandService.onCommandFailed.listen(errorInfo => {
            this.message.setValue(errorInfo.errorMessage);
            if (errorInfo.details) {
                this.details.setValue(errorInfo.details);
            } else {
                this.details.clear();
            }

            this.isActive.setValue(true);
        });
    }

    clear() {
        this.isActive.setValue(false);
    }
}

class ActivitiesSynschronizer<TActivity extends ManagableActivity, TActivityViewModel extends ManagableActivityViewModel<any>> {
    constructor(
        private identityChecker: (activity: TActivity, activityViewModel: TActivityViewModel) => boolean,
        private mapper: (activity: TActivity) => TActivityViewModel,
        private list: js.ObservableList<TActivityViewModel>) {
    }

    sync(activities: TActivity[]) {
        var existingActivities: TActivityViewModel[] = this.list.getValue();
        var deletedActivities = _.filter(
            existingActivities,
            viewModel => _.every(activities, activity => this.areNotEqual(activity, viewModel)));

        var addedActivities = _.filter(
            activities,
            activity => _.every(existingActivities, viewModel => this.areNotEqual(activity, viewModel)));

        var updatedActivities = _.filter(
            existingActivities,
            viewModel => _.some(activities, activity => this.areEqual(activity, viewModel)));

        var addedViewModels = _.map(addedActivities, this.mapper);

        var finder = (viewModel: TActivityViewModel) => _.find(activities, activity => this.areEqual(activity, viewModel));

        _.each(deletedActivities, viewModel => this.list.remove(viewModel));
        _.each(addedViewModels, viewModel => {
            viewModel.updateFrom(finder(viewModel));
            this.list.add(viewModel);
        });
        _.each(updatedActivities, viewModel => viewModel.updateFrom(finder(viewModel)));
    }

    private areEqual(activity: TActivity, activityViewModel: TActivityViewModel) {
        return this.identityChecker(activity, activityViewModel);
    }

    private areNotEqual(activity: TActivity, activityViewModel: TActivityViewModel) {
        return !this.identityChecker(activity, activityViewModel);
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
            .done(data => this.applicationModel.setData(data));
    }

    stopScheduler() {
        this.commandService
            .executeCommand(new StopSchedulerCommand())
            .done(data => this.applicationModel.setData(data));
    }

    refreshData() {
        this.commandService
            .executeCommand(new GetDataCommand())
            .done(data => this.applicationModel.setData(data));
    }
}

class ManagableActivityViewModel<TActivity extends ManagableActivity> {
    name: string;
    status = js.observableValue<ActivityStatus>();
    canStart = js.observableValue<boolean>();
    canPause = js.observableValue<boolean>();

    constructor(
        activity: ManagableActivity,
        public commandService: SchedulerService,
        public applicationModel: ApplicationModel) {

        this.name = activity.Name;
    }

    updateFrom(activity: TActivity) {
        this.status.setValue(activity.Status);
        this.canStart.setValue(activity.CanStart);
        this.canPause.setValue(activity.CanPause);
    }

    resume() {
        this.commandService
            .executeCommand(this.createResumeCommand())
            .done(data => this.applicationModel.setData(data));
    }

    pause() {
        this.commandService
            .executeCommand(this.createPauseCommand())
            .done(data => this.applicationModel.setData(data));
    }

    createResumeCommand(): ICommand<SchedulerData> {
        throw new Error("Abstract method call");
    }

    createPauseCommand(): ICommand<SchedulerData> {
        throw new Error("Abstract method call");
    }
}

class JobGroupViewModel extends ManagableActivityViewModel<JobGroup> {
    jobs = js.observableList<JobViewModel>();

    private jobsSynchronizer: ActivitiesSynschronizer<Job, JobViewModel> = new ActivitiesSynschronizer<Job, JobViewModel>(
        (job: Job, jobViewModel: JobViewModel) => job.Name === jobViewModel.name,
        (job: Job) => new JobViewModel(job, this.name, this.commandService, this.applicationModel),
        this.jobs);

    constructor(group: JobGroup, commandService: SchedulerService, applicationModel: ApplicationModel) {
        super(group, commandService, applicationModel);
    }

    updateFrom(group: JobGroup) {
        super.updateFrom(group);

        this.jobsSynchronizer.sync(group.Jobs);
    }

    createResumeCommand(): ICommand<SchedulerData> {
        return new ResumeGroupCommand(this.name);
    }

    createPauseCommand(): ICommand<SchedulerData> {
        return new PauseGroupCommand(this.name);
    }
}

class JobViewModel extends ManagableActivityViewModel<Job> {
    triggers = js.observableList<TriggerViewModel>();
    details = js.observableValue<JobDetails>();

    private triggersSynchronizer: ActivitiesSynschronizer<Trigger, TriggerViewModel> = new ActivitiesSynschronizer<Trigger, TriggerViewModel>(
        (trigger: Trigger, triggerViewModel: TriggerViewModel) => trigger.Name === triggerViewModel.name,
        (trigger: Trigger) => new TriggerViewModel(trigger, this.commandService, this.applicationModel),
        this.triggers);

    constructor(job: Job, private group: string, commandService: SchedulerService, applicationModel: ApplicationModel) {
        super(job, commandService, applicationModel);
    }

    loadJobDetails() {
        this.commandService
            .executeCommand(new GetJobDetailsCommand(this.group, this.name))
            .done(details => this.details.setValue(details));
    }

    updateFrom(job: Job) {
        super.updateFrom(job);

        this.triggersSynchronizer.sync(job.Triggers);
    }

    executeNow() {
        this.commandService
            .executeCommand(new ExecuteNowCommand(this.group, this.name))
            .done(data => this.applicationModel.setData(data));
    }

    createResumeCommand(): ICommand<SchedulerData> {
        return new ResumeJobCommand(this.group, this.name);
    }

    createPauseCommand(): ICommand<SchedulerData> {
        return new PauseJobCommand(this.group, this.name);
    }

    clearJobDetails(): void {
        this.details.setValue(null);
    }
}


class TriggerViewModel extends ManagableActivityViewModel<Trigger> {
    startDate = js.observableValue<NullableDate>();
    endDate = js.observableValue<NullableDate>();
    previousFireDate = js.observableValue<NullableDate>();
    nextFireDate = js.observableValue<NullableDate>();

    private _group: string;

    constructor(trigger: Trigger, commandService: SchedulerService, applicationModel: ApplicationModel) {
        super(trigger, commandService, applicationModel);
    }

    updateFrom(trigger: Trigger) {
        this._group = trigger.GroupName;

        super.updateFrom(trigger);

        this.startDate.setValue(new NullableDate(trigger.StartDate));
        this.endDate.setValue(new NullableDate(trigger.EndDate));
        this.previousFireDate.setValue(new NullableDate(trigger.PreviousFireDate));
        this.nextFireDate.setValue(new NullableDate(trigger.NextFireDate));
    }

    createResumeCommand(): ICommand<SchedulerData> {
        return new ResumeTriggerCommand(this._group, this.name);
    }

    createPauseCommand(): ICommand<SchedulerData> {
        return new PauseTriggerCommand(this._group, this.name);
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