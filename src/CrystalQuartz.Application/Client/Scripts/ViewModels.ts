/// <reference path="../Definitions/john-smith-latest.d.ts"/>
/// <reference path="../Definitions/lodash.d.ts"/>
/// <reference path="Models.ts"/>
/// <reference path="Services.ts"/>

class ApplicationViewModel implements js.IViewModel {
    private static DEFAULT_UPDATE_INTERVAL = 30000; // 30sec

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
    autoUpdateMessage = js.observableValue<string>();

    private _autoUpdateTimes: number;

    private setData(data: SchedulerData) {
        this.scheduler.updateFrom(data);
        this.groupsSynchronizer.sync(data.JobGroups);

        this.scheduleAutoUpdate(data);
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

    scheduleAutoUpdate(data: SchedulerData) {
        var nextUpdateDate = this.getLastActivityFireDate(data) || this.getDefaultUpdateDate();

        clearTimeout(this._autoUpdateTimes);

        var now = new Date();
        var sleepInterval = nextUpdateDate.getTime() - now.getTime();
        var message = '';
        if (sleepInterval < 0) {
            sleepInterval = ApplicationViewModel.DEFAULT_UPDATE_INTERVAL;
            nextUpdateDate.setSeconds(nextUpdateDate.getSeconds() + ApplicationViewModel.DEFAULT_UPDATE_INTERVAL / 1000);
        } 

        message = 'next update at ' + nextUpdateDate.toTimeString();
        this.autoUpdateMessage.setValue(message);    

        this._autoUpdateTimes = setTimeout(() => {
            this.autoUpdateMessage.setValue('updating...');
            this.updateData();
        }, sleepInterval);
    }

    private updateData() {
        this.commandService.getData().done((data) => this.applicationModel.setData(data));
    }

    private getDefaultUpdateDate() {
        var now = new Date();
        now.setSeconds(now.getSeconds() + 30);
        return now;
    }

    private getLastActivityFireDate(data: SchedulerData): Date {
        if (data.Status !== 'started') {
            return null;
        }

        var allJobs        = _.flatten(_.map(data.JobGroups, group => group.Jobs)),
            allTriggers    = _.flatten(_.map(allJobs, (job: Job) => job.Triggers)),
            activeTriggers = _.filter(allTriggers, (trigger: Trigger) => trigger.Status.Code == 'active'),
            nextFireDates  = _.compact(_.map(activeTriggers, (trigger: Trigger) => trigger.NextFireDate == null ? null : trigger.NextFireDate.Ticks));

        return nextFireDates.length > 0 ? new Date(_.first(nextFireDates)) : null;
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
    canDelete = js.observableValue<boolean>();

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
        this.canDelete.setValue(activity.CanDelete);
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

    delete() {
        if (confirm(this.getDeleteConfirmationsText())) {
            this.commandService
                .executeCommand(this.createDeleteCommand())
                .done(data => this.applicationModel.setData(data));
        }
    }

    getDeleteConfirmationsText(): string {
        return 'Are you sure?';
    }

    createResumeCommand(): ICommand<SchedulerData> {
        throw new Error("Abstract method call");
    }

    createPauseCommand(): ICommand<SchedulerData> {
        throw new Error("Abstract method call");
    }

    createDeleteCommand(): ICommand<SchedulerData> {
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

    getDeleteConfirmationsText(): string {
        return 'Are you sure you want to delete all jobs?';
    }

    createResumeCommand(): ICommand<SchedulerData> {
        return new ResumeGroupCommand(this.name);
    }

    createPauseCommand(): ICommand<SchedulerData> {
        return new PauseGroupCommand(this.name);
    }

    createDeleteCommand(): ICommand<SchedulerData> {
        return new DeleteGroupCommand(this.name);
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

    getDeleteConfirmationsText(): string {
        return 'Are you sure you want to delete job?';
    }

    createResumeCommand(): ICommand<SchedulerData> {
        return new ResumeJobCommand(this.group, this.name);
    }

    createPauseCommand(): ICommand<SchedulerData> {
        return new PauseJobCommand(this.group, this.name);
    }

    createDeleteCommand(): ICommand<SchedulerData> {
        return new DeleteJobCommand(this.group, this.name);
    }

    clearJobDetails(): void {
        this.details.setValue(null);
    }
}

interface TimespanPart {
    multiplier: number;
    pluralLabel: string;
    label: string;
}

class TriggerViewModel extends ManagableActivityViewModel<Trigger> {
    startDate = js.observableValue<NullableDate>();
    endDate = js.observableValue<NullableDate>();
    previousFireDate = js.observableValue<NullableDate>();
    nextFireDate = js.observableValue<NullableDate>();
    triggerType = js.observableValue<string>();

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

        var triggerType = trigger.TriggerType;
        var triggerTypeMessage = 'unknown';
        if (triggerType.Code === 'simple') {
            var simpleTriggerType = <SimpleTriggerType> triggerType;

            triggerTypeMessage = 'repeat ';
            if (simpleTriggerType.RepeatCount === -1) {
            } else {
                triggerTypeMessage += simpleTriggerType.RepeatCount + ' times ';
            }

            triggerTypeMessage += 'every ';

            var parts: TimespanPart[] = [
                {
                    label: 'day',
                    pluralLabel: 'days',
                    multiplier: 1000 * 60 * 60 * 24
                },
                {
                    label: 'hour',
                    pluralLabel: 'hours',
                    multiplier: 1000 * 60 * 60
                },
                {
                    label: 'minute',
                    pluralLabel: 'min',
                    multiplier: 1000 * 60
                },
                {
                    label: 'second',
                    pluralLabel: 'sec',
                    multiplier: 1000
                }
            ];

            var diff = simpleTriggerType.RepeatInterval;
            var messagesParts: string[] = [];
            for (var i = 0; i < parts.length; i++) {
                var part = parts[i];
                var currentPartValue = Math.floor(diff / part.multiplier);
                diff -= currentPartValue * part.multiplier;

                if (currentPartValue == 1) {
                    messagesParts.push(part.label);
                } else if (currentPartValue > 1) {
                    messagesParts.push(currentPartValue + ' ' + part.pluralLabel);
                }
            }

            triggerTypeMessage += messagesParts.join(', ');
        } else if (triggerType.Code === 'cron') {
            var cronTriggerType = <CronTriggerType> triggerType;

            triggerTypeMessage = cronTriggerType.CronExpression;
        }

        this.triggerType.setValue(triggerTypeMessage);
    }

    getDeleteConfirmationsText(): string {
        return 'Are you sure you want to unchedule trigger?';
    }

    createResumeCommand(): ICommand<SchedulerData> {
        return new ResumeTriggerCommand(this._group, this.name);
    }

    createPauseCommand(): ICommand<SchedulerData> {
        return new PauseTriggerCommand(this._group, this.name);
    }

    createDeleteCommand(): ICommand<SchedulerData> {
        return new DeleteTriggerCommand(this._group, this.name);
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