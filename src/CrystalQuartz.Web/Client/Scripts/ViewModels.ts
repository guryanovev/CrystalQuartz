/// <reference path="../Definitions/john-smith-latest.d.ts"/>
/// <reference path="../Definitions/lodash.d.ts"/>
/// <reference path="Models.ts"/>
/// <reference path="Services.ts"/>

class ApplicationViewModel {
    private groupsSynchronizer: ActivitiesSynschronizer<JobGroup, JobGroupViewModel>;

    constructor(private applicationModel: ApplicationModel, private commandService: SchedulerService) {
        this.scheduler = new SchedulerViewModel(commandService, applicationModel);
        this.commandProgress = new CommandProgressViewModel(commandService);

        applicationModel.onDataChanged.listen(data => this.setData(data));
        commandService.onCommandFailed.listen(errorInfo => alert(errorInfo.errorMessage));

        this.groupsSynchronizer = new ActivitiesSynschronizer<JobGroup, JobGroupViewModel>(
            (group: JobGroup, groupViewModel: JobGroupViewModel) => group.Name === groupViewModel.name,
            (group: JobGroup) => new JobGroupViewModel(group, this.commandService, this.applicationModel),
            this.jobGroups);
    }

    scheduler: SchedulerViewModel;
    commandProgress: CommandProgressViewModel;
    jobGroups = js.observableList<JobGroupViewModel>();

    private setData(data: SchedulerData) {
        //var groups = _.map(data.JobGroups, (group: JobGroup) => new JobGroupViewModel(group, this.commandService, this.applicationModel));
        
        this.scheduler.updateFrom(data);
        this.groupsSynchronizer.sync(data.JobGroups);

        //this.syncGroups(data.JobGroups);

        //this.jobGroups.setValue(groups);
    }

    private syncGroups(groups: JobGroup[]) {
        var existingGroups = this.jobGroups.getValue();
        var identity = (group: JobGroup, groupViewModel: JobGroupViewModel) => group.Name === groupViewModel.name;

        var deletedGroups = _.filter(
            existingGroups,
            groupViewModel => _.every(groups, group => !identity(group, groupViewModel)));

        var addedGroups = _.filter(
            groups,
            group => _.every(existingGroups, groupViewModel => !identity(group, groupViewModel)));

        var updatedGroups = _.filter(
            existingGroups,
            groupViewModel => _.some(groups, group => identity(group, groupViewModel)));

        var addedGroupViewModels = _.map(addedGroups, (group: JobGroup) => new JobGroupViewModel(group, this.commandService, this.applicationModel));

        console.log('deleted groups', deletedGroups);
        console.log('added groups', addedGroupViewModels);
        console.log('updated groups', updatedGroups);

        _.each(deletedGroups, groupViewModel => this.jobGroups.remove(groupViewModel));
        _.each(addedGroupViewModels, groupViewModel => {
            groupViewModel.updateFrom(_.find(groups, group => group.Name === groupViewModel.name));
            this.jobGroups.add(groupViewModel);
        });
        _.each(updatedGroups, groupViewModel => groupViewModel.updateFrom(_.find(groups, group => group.Name === groupViewModel.name)));
    }

    getCommandProgress() {
        return new CommandProgressViewModel(this.commandService);
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

        console.log('deleted activities', deletedActivities);
        console.log('added activities', addedViewModels);
        console.log('updated activities', updatedActivities);

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
        (trigger: Trigger) => new TriggerViewModel(trigger, this.group, this.commandService, this.applicationModel),
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

    createResumeCommand(): ICommand<SchedulerData> {
        return new ResumeJobCommand(this.group, this.name);
    }

    createPauseCommand(): ICommand<SchedulerData> {
        return new PauseJobCommand(this.group, this.name);
    }
}


class TriggerViewModel extends ManagableActivityViewModel<Trigger> {
    startDate = js.observableValue<NullableDate>();
    endDate = js.observableValue<NullableDate>();
    previousFireDate = js.observableValue<NullableDate>();
    nextFireDate = js.observableValue<NullableDate>();

    constructor(trigger: Trigger, private group: string, commandService: SchedulerService, applicationModel: ApplicationModel) {
        super(trigger, commandService, applicationModel);
    }

    /*
    resume() {
        this.commandService
            .executeCommand(new ResumeTriggerCommand(this.job.GroupName, this.name))
            .done(data => this.applicationModel.setData(data));
    }

    pause() {
        this.commandService
            .executeCommand(new PauseTriggerCommand(this.job.GroupName, this.name))
            .done(data => this.applicationModel.setData(data));
    }*/

    updateFrom(trigger: Trigger) {
        super.updateFrom(trigger);

        this.startDate.setValue(new NullableDate(trigger.StartDate));
        this.endDate.setValue(new NullableDate(trigger.EndDate));
        this.previousFireDate.setValue(new NullableDate(trigger.PreviousFireDate));
        this.nextFireDate.setValue(new NullableDate(trigger.NextFireDate));
    }

    createResumeCommand(): ICommand<SchedulerData> {
        return new ResumeTriggerCommand(this.group, this.name);
    }

    createPauseCommand(): ICommand<SchedulerData> {
        return new PauseTriggerCommand(this.group, this.name);
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